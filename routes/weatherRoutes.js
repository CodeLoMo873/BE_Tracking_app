const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// Get current weather data
router.get('/', weatherController.getCurrentWeather);

// Force update weather data
router.post('/update', weatherController.updateWeatherData);

module.exports = router;