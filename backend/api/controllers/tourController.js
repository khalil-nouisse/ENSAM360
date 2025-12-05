
const tourService = require('../services/tourService');

const getNextLocationsID = async (req, res)=>{
    try{
        // Ensure the async service call is awaited so we return the resolved array
        const ids = await tourService.getNextLocationsID(req.params.id)
        res.status(200).json(ids);

    }catch(err){
        res.status(500).json({
            message : "Error fetching Next Locations ID" , 
            error : err.message
        });
    }
};

const getLocationInfoByID = async(req , res)=>{
    try{
        const informations = await tourService.getLocationInfoByID(req.query.id);
        console.log(informations);
        res.status(200).json(informations);

    }catch(err){
        res.status(500).json({
            message : "Error fetching Location Infos by ID",
            error : err.message
        });
    }
};



module.exports = {
    getNextLocationsID , 
    getLocationInfoByID
}



