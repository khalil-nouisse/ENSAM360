//Handles req/res for map routes.
//import the brain (service)

const mapService = require('../services/mapService');

/**
 * @controller getAllBuildings
 * Handles the HTTP request and response for fetching all locations.
 */

const getShortestPath = async (req , res) => {
    try{
        const path = await mapService.getShortestPath(req.body.startID , req.body.endID);
        res.status(200).json(path);
    }catch(err){
        res.status(500).json({
            message : "Error fetching shortest path",
            error : err.message
        });
    }
};

const getAllBuildings = async (req , res)=> {



    try{

        // 1. Call the service to get the data
        const locations = await mapService.getAllBuildings();
        
        // 2. Send a success response with the data
        res.status(200).json(locations);

    }catch(err){
        res.status(500).json({
            message : "Error fetching locations",
            error : err.message
        });
    }
};

const getAllLocations = async (req , res)=> {



    try{

        // 1. Call the service to get the data
        const locations = await mapService.getAllLocations();
        
        // 2. Send a success response with the data
        res.status(200).json(locations);

    }catch(err){
        res.status(500).json({
            message : "Error fetching locations",
            error : err.message
        });
    }
};


const createLocation = async (req , res) => {
    try{
        await mapService.createLocation(req.body);
        res.status(200).json({message : "Location Created Succesfully"});

    }catch(err){
        res.status(500).json({
            message : "Error fetching locations",
            error : err.message
        });
    }
};

const getLocationByID =async (req,res) =>{
    try{
        const id = req.params.id;
        const nextLocations = await mapService.getLocationByID(id);
        res.status(200).json(nextLocations);
    }catch(err){
        res.status(500).json({
            message : "Error fetching next locations",
            error : err.message
        });
    }
};


const getPrincipalLocations = async (req , res) => {
    try{
        console.log("hello world")
        const principaleLocations = await mapService.getPrincipalLocations();

        res.status(200).json(principaleLocations);
    }catch(err){
        res.status(500).json({
            message : "Error fetching Principale locations",
            error : err.message
        });
    }
}

module.exports = {
    getAllLocations,
    getAllBuildings,
    createLocation,
    getLocationByID , 

    getPrincipalLocations,
    getShortestPath

}