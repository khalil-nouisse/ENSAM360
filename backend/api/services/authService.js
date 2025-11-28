const driver = require('../../config/neo4j');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const sendEmail = require('../../utils/sendEmail');
require('dotenv').config()

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

const register = async (firstName, lastName, email, Password,) => {
    const session = driver.session();
    try {
        //check if the user already exists 
        const checkQuery = `MATCH (u:User{email: $email}) RETURN u`;
        const checkResult = await session.run(checkQuery, { email });

        if (checkResult.records.length > 0) {
            const existingUser = checkResult.records[0].get('u').properties;

            if (existingUser.isVerified) {
                throw new Error('User with this email already exists.');
            }
            else {
                // User exists but hasn't verified yet.
                throw new Error('User exists but is not verified. Please check your email for the code.');
            }
        }
        //Hash password
        // A salt is a random string added to the password before hashing.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        //Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        const cipherQuery = `
            CREATE (u:User{
                id : randomUUID() ,
                firstname : $firstName ,
                lastname : $lastName , 
                email : $email , 
                password : $hashedPassword ,
                createdAt: timestamp() ,
                isVerified: false,
                otp: $otp,
                otpExpires: $otpExpires
            })
            RETURN u.id As id ,
                u.firstname AS firstname ,
                u.lastname AS lastname ,
                u.email AS email 
        `;

        const result = await session.run(cipherQuery, {
            firstName, lastName, email, hashedPassword, otp, otpExpires
        });

        if (result.records.length === 0) {
            throw new Error("Could not create user");
        }
        console.log("User created in DB, sending email...");

        //send email
        await sendEmail(email, otp);
        console.log("Email process finished");

        return result.records[0].toObject();

    } catch (error) {
        // Handle specific error for unique email constraint
        if (error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
            throw new Error('Email already exists.');
        }
        throw error;
    } finally {
        await session.close();
    }
};


const login = async (email, password) => {
    const session = driver.session();
    const cipherQuery = `
        MATCH (u:User {email : $email})
        RETURN u
    `;
    try {
        const result = await session.run(cipherQuery, { email });

        if (result.records.length === 0) {
            throw new Error("User Not Found!");
        }

        const node = result.records[0].get('u');

        //Block unverified users ---
        if (node.properties.isVerified === false) {
            throw new Error("Please verify your email address before logging in.");
        }

        const userPassword = node.properties.password;

        const matchPassword = await bcrypt.compare(password, userPassword);

        if (!matchPassword) {
            throw new Error('Invalid credentials');
        }

        // create JWT
        const payload = {
            user: {
                id: node.properties.id,
                firstname: node.properties.firstname,
                lastname: node.properties.lastname,
                email: node.properties.email
            }
        };

        const accessToken = jwt.sign(
            payload.user,
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            payload.user,
            REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // inserting the refresh Token in the database ??
        userID = node.properties.id;

        cipher = `
            MATCH (u:User {id:$userID})
            SET u.refreshToken = $refreshToken
        `;

        await session.run(cipher, { userID, refreshToken });

        return { refreshToken, accessToken };
    } catch (err) {
        throw err
    } finally {
        session.close();
    }
};

const refreshToken = async (providedRefreshToken) => {
    const session = driver.session();

    try {
        const decoded = jwt.verify(providedRefreshToken, REFRESH_TOKEN_SECRET);
        const cypherQuery = `
            MATCH (u:User {id: $userId})
            WHERE u.refreshToken = $providedRefreshToken
            RETURN u
            `;
        const result = await session.run(cypherQuery, {
            userId: decoded.id,
            providedRefreshToken,
        });

        if (result.records.length === 0) {
            // This is a security check. If the token is valid but not
            // in the DB, it might have been stolen or logged out.
            throw new Error('Refresh token not found or has been invalidated.');
        }
        const userNode = result.records[0].get('u').properties;

        // 3. Issue a new ACCESS token (not a new refresh token)
        const payload = {
            user: {
                id: userNode.id,
                firstname: userNode.firstname,
                lastname: userNode.lastname,
                email: userNode.email
            }
        };

        const newAccessToken = jwt.sign(
            payload.user,
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        return { accessToken: newAccessToken };

    } catch (error) {
        throw new Error('Invalid refresh token.', error);
    } finally {
        await session.close();
    }
};

const logout = async (userID) => {
    const session = driver.session();
    try {
        //const user = getUserbyID(userID);

        cipherQuery = `
            MATCH (u:User {id:$userID})
            SET u.refreshToken=null
            RETURN u.id As id
        `;

        await session.run(cipherQuery, { userID });

        return { message: "Loged out succesfully" };

    } catch (err) {
        throw new Error('Error loging out ', err);
    } finally {
        await session.close();
    }
};

const getUserbyID = async (userID) => {
    const session = driver.session();
    try {
        cipherQuery = `
            MATCH (u:User {id:$userID})
            return u
        `;

        const result = await session.run(cipherQuery, { userID });

        if (result.records.length === 0) {
            throw new Error("Could not find user");
        }

        return result.records[0].toObject();


    } catch (err) {
        throw new Error('unable to get the user', err);
    } finally {
        session.close();
    }
};

const verifyOTP = async (email, otp) => {
    const session = driver.session();
    try {
        // Find user and return their OTP details
        const query = `
            MATCH (u:User {email: $email})
            RETURN u
        `;
        const result = await session.run(query, { email });

        if (result.records.length === 0) throw new Error("User not found");

        const userNode = result.records[0].get('u');
        const user = userNode.properties;

        // 1. Check if code matches
        if (user.otp !== otp) {
            throw new Error("Invalid Verification Code");
        }

        // 2. Check if expired
        if (user.otpExpires < Date.now()) {
            throw new Error("Verification Code has expired");
        }

        // 3. Activate User
        const updateQuery = `
            MATCH (u:User {email: $email})
            SET u.isVerified = true, 
                u.otp = null, 
                u.otpExpires = null
            RETURN u.email
        `;

        await session.run(updateQuery, { email });

        return { message: "Account Verified Successfully" };

    } finally {
        session.close();
    }
};

module.exports = {
    register,
    login,
    refreshToken,
    logout,
    verifyOTP
};