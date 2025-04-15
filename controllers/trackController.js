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
  try {
    const tracks = await Track.find().populate(['artists', 'album']);
    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSuggestedTracks = async (req, res) => {
  const { weather } = req.query;
  if (!weather) return res.status(400).json({ error: 'Missing weather query' });

  const tracks = await Track.find({ weatherTags: weather.toLowerCase() }).populate('artist album');
  res.json(tracks);
};

exports.getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id).populate(['artists', 'album']);
    if (!track) return res.status(404).json({ error: 'Track not found' });
    res.status(200).json(track);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTracksByAlbum = async (req, res) => {
  const { albumId } = req.params;
  try {
    const tracks = await Track.find({ album: albumId }).populate(['artists', 'album']);
    res.status(200).json(tracks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};