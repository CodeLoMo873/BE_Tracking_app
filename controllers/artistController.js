const Artist = require('../models/Artist');

exports.createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    const saved = await artist.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllArtists = async (req, res) => {
  const artists = await Artist.find();
  res.json(artists);
};
