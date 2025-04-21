const express = require('express')
const router = express.Router()
const detailedWeatherController = require('../controllers/detailedWeatherController')

// Get current detailed weather data
router.get('/', detailedWeatherController.getBadWeather)

// Force update detailed weather data
router.post('/update', detailedWeatherController.updateDetailedWeatherData)

module.exports = router
