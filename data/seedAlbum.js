const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Album = require('../models/Album');
const Artist = require('../models/Artist');
const albumData = require('./album.json');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  // await Album.deleteMany();

  const albums = [];

  for (const data of (Array.isArray(albumData) ? albumData : [albumData])) {
    const artistSpotifyIds = data.artists.map(a => a.id);
    
    // Tìm các artist đã seed sẵn theo spotifyId
    const artistDocs = await Artist.find({ spotifyId: { $in: artistSpotifyIds } });

    const album = new Album({
      album_type: data.album_type,
      total_tracks: data.total_tracks,
      external_urls: data.external_urls,
      href: data.href,
      id: data.id,
      images: data.images,
      name: data.name,
      release_date: data.release_date,
      release_date_precision: data.release_date_precision,
      type: data.type,
      uri: data.uri,
      genres: data.genres,
      label: data.label,
      popularity: data.popularity,
      artists: artistDocs.map(a => a._id) // Dùng ObjectId từ artist collection
    });

    albums.push(album);
  }

  await Album.insertMany(albums);
  console.log('📀 Albums seeded and linked to artists successfully!');
  mongoose.connection.close();
})
.catch(err => {
  console.error(err);
  mongoose.connection.close();
});
