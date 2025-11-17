const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

app.get('/login' ,authController.login );
app.get('/register' ,authController.register);


module.exports = router;