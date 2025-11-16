//All routes for locations, paths, 360° (e.g., /api/map/...)
const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController')

//get 2D map locaitons
router.get('/locations' ,mapController.getLocations );


module.exports = router;