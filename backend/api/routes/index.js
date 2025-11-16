//Main router, combines all other routes.
const express = require('express');
const router = express.Router();

const mapRoutes = require('./map');
const tourRoutes = require('./tour')

router.use('/map' , mapRoutes); // 2D map
router.use('/tour' , tourRoutes); // 360 tour

module.exports = router ;
