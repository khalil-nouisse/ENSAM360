//All routes for locations, paths, 360° (e.g., /api/map/...)
const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');
const authMiddleware = require('../../middleware/authMiddleware');
//get 2D map locaitons

// get all locations
router.get('/allLocations' , mapController.getAllLocations );
router.get('/locations' ,mapController.getAllBuildings );
router.post('/locations' , authMiddleware,  mapController.createLocation) ;
router.get('/principaleLocations' , mapController.getPrincipalLocations);
router.post('/shortestPath' , mapController.getShortestPath);


module.exports = router;