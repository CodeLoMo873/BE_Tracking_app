const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.post('/', songController.createSong);
router.get('/', songController.getAllSongs);
router.get('/suggest', songController.getSuggestedSongs);
router.delete('/:id', songController.deleteSong);

module.exports = router;
