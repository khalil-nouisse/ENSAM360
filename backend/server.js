const express = require("express")
const app = express()
const path = require('path')
const cors = require('cors');
const morgan = require('morgan')

//main routes
const mainApiRouter = require('./api/routes/index')

const whiteList = ['http://localhost:5173/'];
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin : (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null, true);
        }
        else{
           callback(new Error('Not Allowed by CORS')) ;
        }
    },
    
    optionsSuccessStatus: 200, // For legacy browser support, keep this set to 200
}


//middlwares
app.use(cors({corsOptions,credentials:true}));
app.use(express.urlencoded({ extended : false})); //built in middlware to handlw urlencoded data (form data)
app.use(express.json());
app.use(morgan('dev'))
//routes
app.use("/api" , mainApiRouter);


//incase we have a false rooting , 
app.use((req , res)=> {
    res.redirect("/");
});


app.listen(PORT, (err) => {
    if(err) console.log(err);
    console.log(`running on port ${PORT || 2000}`);
})