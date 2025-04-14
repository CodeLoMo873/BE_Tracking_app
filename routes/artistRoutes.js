const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artistController');

router.post('/', artistController.createArtist);
router.get('/', artistController.getAllArtists);
router.get('/:id', artistController.getArtistById);

module.exports = router;
