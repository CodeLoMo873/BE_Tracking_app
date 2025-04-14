const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Import models
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB");

    // Xoá dữ liệu cũ
    await Artist.deleteMany();
    await Album.deleteMany();
    await Track.deleteMany();
    await Playlist.deleteMany();

    // Tạo Artist
    const artist1 = new Artist({ name: 'John Doe', bio: 'A famous pop artist.', image: 'https://example.com/artist.jpg' });
    const artist2 = new Artist({ name: 'Jane Smith', bio: 'An emerging rock artist.', image: 'https://example.com/artist2.jpg' });
    await artist1.save();
    await artist2.save();

    // Tạo Album
    const album1 = new Album({ title: 'Sunshine', artist: artist1._id, releaseDate: new Date('2023-05-01'), coverImage: 'https://example.com/sunshine.jpg' });
    const album2 = new Album({ title: 'Rock On', artist: artist2._id, releaseDate: new Date('2023-06-01'), coverImage: 'https://example.com/rockon.jpg' });
    await album1.save();
    await album2.save();

    // Tạo Track
    const track1 = new Track({ title: 'Sunshine', artist: artist1._id, album: album1._id, url: 'https://example.com/sunshine.mp3', genre: 'Pop', weatherTags: ['sunny'], mood: 'happy' });
    const track2 = new Track({ title: 'Rock It', artist: artist2._id, album: album2._id, url: 'https://example.com/rockit.mp3', genre: 'Rock', weatherTags: ['cloudy'], mood: 'energetic' });
    await track1.save();
    await track2.save();

    // Tạo Playlist
    const playlist1 = new Playlist({ name: 'Sunny Playlist', description: 'Perfect for sunny days.', tracks: [track1._id] });
    const playlist2 = new Playlist({ name: 'Rock Playlist', description: 'For when you need energy.', tracks: [track2._id] });
    await playlist1.save();
    await playlist2.save();

    console.log("Data seeded successfully!");

    // Đóng kết nối
    mongoose.connection.close();
  })
  .catch(err => {
    console.error(err);
    mongoose.connection.close();
  });
