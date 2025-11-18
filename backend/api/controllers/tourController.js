
const tourService = require('../services/tourService');

const getNextLocationsID = async (req, res)=>{
    try{
        const ids = tourService.getNextLocationsID(req.params.id)
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
        const informations = tourService.getLocationInfoByID(req.query.id);

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



