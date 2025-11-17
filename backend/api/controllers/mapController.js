//Handles req/res for map routes.
//import the brain (service)

const mapService = require('../services/mapService');

/**
 * @controller getAllLocations
 * Handles the HTTP request and response for fetching all locations.
 */

const getBuildings = async (req , res)=> {
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



module.exports = {
    getBuildings,
}