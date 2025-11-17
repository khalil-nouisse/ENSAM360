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
        const result = await session.run(cipherQuery , {firstName , lastName , email , Password});

        if( result.record.length === 0) {
            throw new Error("Could not create user");
        }

        return {
                id : result.get('id') ,
                firstname : result.get('firstname'),
                lastname : result.get('lastname'),
                email : result.get('email')
            };
        
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
                lastname : node.properties.lastname
            }
        };

        const accessToken = jwt.sign(
                payload.user,
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'1h'}
            )

        const refreshToken = jwt.sign(
                payload.user,
                process.env.REFRESH_TOKEN_SECRET,
                {expiresIn:'1d'}
            )
        
        // inserting the refresh Token in the database ??
        userID = node.properties.id;
        cipher = `
            MATCH (u:USER-{id:$userID})
            SET u.refreshToken : $refreshToken
        `

        await session.run(cipher , {userID , refreshToken} );

        //TODO 

        return {refreshToken ,accessToken} ;
    }catch(err){
        console.log("Invalid Login");
    }finally{
        session.close();
    }
};


module.exports = {
    register , 
    login
}