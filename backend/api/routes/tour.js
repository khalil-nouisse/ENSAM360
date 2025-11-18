const express = require('express');
const router = express.Router();

const tourController = require('../controllers/tourController')

<<<<<<< HEAD
router.get('nextLocations/:id' , tourController.getNextLocationsID);
router.get('location/' , tourController.getLocationInfoByID);
=======
router.get('/nextLocations/:id' , tourController.getNextLocationsID);
router.get('/location/' , tourController.getLocationInfoByID);
>>>>>>> virtual_tour


module.exports = router ;

