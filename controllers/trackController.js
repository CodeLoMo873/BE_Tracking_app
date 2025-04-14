const Track = require('../models/Track');

exports.createTrack = async (req, res) => {
  try {
    const track = new Track(req.body);
    const saved = await track.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTracks = async (req, res) => {
  const tracks = await Track.find().populate('artist album');
  res.json(tracks);
};

exports.getSuggestedTracks = async (req, res) => {
  const { weather } = req.query;
  if (!weather) return res.status(400).json({ error: 'Missing weather query' });

  const tracks = await Track.find({ weatherTags: weather.toLowerCase() }).populate('artist album');
  res.json(tracks);
};
