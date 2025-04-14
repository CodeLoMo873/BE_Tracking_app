const express = require('express');
const router = express.Router();
const playlistController = require('../controllers/playlistController');

router.post('/', playlistController.createPlaylist);
router.get('/', playlistController.getPlaylists);
router.put('/:id/add-track', playlistController.addTrackToPlaylist);

module.exports = router;
