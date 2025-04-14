// models/Track.js
const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
  url: { type: String, required: true },
  duration: Number,
  genre: String,
  weatherTags: [String],
  mood: String,
});

module.exports = mongoose.model('Track', trackSchema);
