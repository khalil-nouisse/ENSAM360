//All routes for the chatbot (e.g., /api/chatbot/...)
const express = require('express');
const router = express.Router();

const chatbotController = require('../controllers/chatbotController');
const authMiddleware = require('../../middleware/authMiddleware');

router.post("/"  , chatbotController.handleChat);


module.exports = router