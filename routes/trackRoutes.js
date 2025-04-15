const express = require('express');
const router = express.Router();
const trackController = require('../controllers/trackController');

router.post('/', trackController.createTrack);
router.get('/', trackController.getTracks);
router.get('/suggest', trackController.getSuggestedTracks); // ?weather=sunny
router.get('/:id', trackController.getTrackById);
router.get('/album/:albumId', trackController.getTracksByAlbum);
module.exports = router;
