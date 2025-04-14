const Playlist = require('../models/Playlist');
const Track = require('../models/Track');

exports.createPlaylist = async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    const saved = await playlist.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPlaylists = async (req, res) => {
  const playlists = await Playlist.find().populate('tracks');
  res.json(playlists);
};

exports.addTrackToPlaylist = async (req, res) => {
  try {
    const { trackId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    if (!playlist.tracks.includes(trackId)) {
      playlist.tracks.push(trackId);
      await playlist.save();
    }

    res.json(playlist);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
