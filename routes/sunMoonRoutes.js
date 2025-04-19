const express = require('express');
const router = express.Router();
const sunMoonController = require('../controllers/sunMoonController');

// Get sun-moon data
router.get('/', sunMoonController.getSunMoonData);

// Force update sun-moon data
router.post('/update', sunMoonController.updateSunMoonData);

module.exports = router;