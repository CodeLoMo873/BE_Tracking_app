const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  album_type: String,
  total_tracks: Number,
  external_urls: {
    spotify: String
  },
  href: String,
  id: { type: String, unique: true }, // Spotify ID
  images: [
    {
      url: String,
      height: Number,
      width: Number
    }
  ],
  name: String,
  release_date: String,
  release_date_precision: String,
  type: String,
  uri: String,
  genres: [String],
  label: String,
  popularity: Number,
  weatherCondition: String,

  artists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist'
  }]
});

module.exports = mongoose.model('Album', albumSchema);
