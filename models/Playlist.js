// models/Playlist.js
const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);
