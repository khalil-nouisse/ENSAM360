const driver = require('../../config/neo4j');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { ACCESS_TOKEN_SECRET , REFRESH_TOKEN_SECRET } = process.env

const register = async (firstName , lastName , email , Password , ) =>{
    // A salt is a random string added to the password before hashing.
    const salt = await bcrypt.genSalt(10); 
	const hashedPassword = await bcrypt.hash(Password ,salt);

    const session = driver.session();

    const cipherQuery = `
        CREATE (u:USER{
            id : randomUUID() ,
            firstname : $firstName ,
            lastname : $lastName , 
            email : $email , 
            password : $hashedPassword ,
            createdAt: timestamp()
        })
        RETURN u.id As id ,
               u.firstname AS firstname ,
               u.lastname AS lastname ,
               u.email AS email 
        `;
    try{
        const result = await session.run(cipherQuery , {firstName , lastName , email , hashedPassword});

        if( result.records.length === 0) {
            throw new Error("Could not create user");
        }

        return result.records[0].toObject();
        
    }catch (error) {
        // Handle specific error for unique email constraint
        if (error.code === 'Neo.ClientError.Schema.ConstraintValidationFailed') {
        throw new Error('Email already exists.');
        }
        throw error;
    }finally {
        await session.close();
    }
};


const login = async (email , password)=>{
    const session = driver.session();
    const cipherQuery = `
        MATCH (u:USER {email : $email})
        RETURN u
    `;
    try {
        const result = await session.run(cipherQuery , {email} );

        if( result.records.length === 0 ){
            throw new Error("User Not Found!");
        }

        const node = result.records[0].get('u');
        const userPassword = node.properties.password;

        const matchPassword = await bcrypt.compare(password , userPassword);

        if(!matchPassword){
            throw new Error('Invalid credentials');
        }

        // create JWT
        const payload = {
            user : {
                id : node.properties.id ,
                firstname : node.properties.firstname ,
                lastname : node.properties.lastname ,
                email : node.properties.email
            }
        };

        const accessToken = jwt.sign(
                payload.user,
                ACCESS_TOKEN_SECRET,
                {expiresIn:'1h'}
            );

        const refreshToken = jwt.sign(
                payload.user,
                REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            );
        
        // inserting the refresh Token in the database ??
        userID = node.properties.id;

        cipher = `
            MATCH (u:USER {id:$userID})
            SET u.refreshToken = $refreshToken
        `;

        await session.run(cipher , {userID , refreshToken} );

        return {refreshToken ,accessToken} ;
    }catch(err){
        throw err
    }finally{
        session.close();
    }
};

const refreshToken =async (providedRefreshToken)=>{
    const session = driver.session();

    try {
        const decoded = jwt.verify(providedRefreshToken, REFRESH_TOKEN_SECRET);
        const cypherQuery = `
            MATCH (u:USER {id: $userId})
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
            user : {
                id : userNode.id ,
                firstname : userNode.firstname ,
                lastname : userNode.lastname ,
                email : userNode.email
            }
        };

        const newAccessToken = jwt.sign(
            payload.user,
            ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        return { accessToken: newAccessToken };

    }catch(error){
        throw new Error('Invalid refresh token.', error);
    }finally{
        await session.close();
    }
};

const logout = async (userID)=>{
    const session = driver.session();
    try{
        //const user = getUserbyID(userID);
        
        cipherQuery = `
            MATCH (u:USER {id:$userID})
            SET u.refreshToken=null
            RETURN u.id As id
        `;

        await session.run(cipherQuery, {userID});

        return {message : "Loged out succesfully"};

    }catch(err){
        throw new Error('Error loging out ',err);
    }finally{
        await session.close();
    }
};

const getUserbyID = async(userID)=>{
    const session = driver.session();
    try{
        cipherQuery = `
            MATCH (u:USER {id:$userID})
            return u
        `;
        
        const result = await session.run(cipherQuery , {userID});

        if( result.records.length === 0) {
            throw new Error("Could not find user");
        }

        return result.records[0].toObject();
        

    }catch(err){
        throw new Error('unable to get the user' , err);
    }finally{
        session.close();
    }
};

module.exports = {
    register , 
    login ,
    refreshToken , 
    logout,
};