const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Track = require('../models/Track');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const fs = require('fs');
dotenv.config();

const seedData = require('./tracks.json');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("Connected to MongoDB");

//   await Track.deleteMany();

  const tracks = [];

  for (const track of seedData.tracks) {
    // Tìm các artist theo Spotify ID
    const artistDocs = await Artist.find({ spotifyId: { $in: track.artists.map(a => a.id) } });
    const artistIds = artistDocs.map(a => a._id);

    if (artistDocs.length === 0) {
      console.warn(`❌ Skipped track "${track.name}" — missing artists`);
      continue;
    }

    // Tìm 1 album có ít nhất 1 trong số các artist này
    const albumDoc = await Album.findOne({ artists: { $in: artistIds } });

    if (!albumDoc) {
      console.warn(`❌ Skipped track "${track.name}" — no album found for artist(s)`);
      continue;
    }

    tracks.push({
      artists: artistIds,
      album: albumDoc._id,
      disc_number: track.disc_number,
      duration_ms: track.duration_ms,
      explicit: track.explicit,
      external_urls: track.external_urls,
      href: track.href,
      id: track.id,
      name: track.name,
      preview_url: track.preview_url,
      track_number: track.track_number,
      type: track.type,
      uri: track.uri,
      is_local: track.is_local
    });
  }

  await Track.insertMany(tracks);
  console.log(`🎵 Seeded ${tracks.length} tracks successfully!`);

  mongoose.connection.close();
})
.catch(err => {
  console.error(err);
  mongoose.connection.close();
});
