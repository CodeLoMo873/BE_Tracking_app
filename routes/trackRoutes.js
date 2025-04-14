const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

router.post('/', trackController.createTrack);
router.get('/', trackController.getTracks);
router.get('/suggest', trackController.getSuggestedTracks); // ?weather=sunny

module.exports = router;
