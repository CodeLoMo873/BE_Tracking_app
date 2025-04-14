const Song = require('../models/Song');

exports.createSong = async (req, res) => {
  try {
    const song = new Song(req.body);
    const saved = await song.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllSongs = async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
};

exports.getSuggestedSongs = async (req, res) => {
  const weather = req.query.weather;
  if (!weather) return res.status(400).json({ error: 'Missing weather query' });

  const songs = await Song.find({ weatherTags: weather.toLowerCase() });
  res.json(songs);
};

exports.deleteSong = async (req, res) => {
  try {
    await Song.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(404).json({ error: 'Song not found' });
  }
};
