//Main router, combines all other routes.
const express = require('express');
const router = express.Router();

const mapRoutes = require('./map');
const tourRoutes = require('./tour');
const authRoutes = require('./auth');
const chatbotRoute = require('./chatbot');

router.use('/map' , mapRoutes); // 2D map
router.use('/tour' , tourRoutes); // 360 tour
router.use('/auth' , authRoutes); //authentification
router.use('/chatbot' , chatbotRoute); //authentification

module.exports = router ;
