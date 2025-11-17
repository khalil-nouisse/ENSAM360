const express = require('express');
const router = express.Router();

const tourController = require('../controllers/tourController')

router.get('/nextLocations/:id' , tourController.getNextLocationsID);
router.get('/location/:id' , tourController.getLocationInfoByID);


module.exports = router ;

