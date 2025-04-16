const Album = require('../models/Album');

exports.getAllAlbums = async (req, res) => {
  try {
    const { artistId } = req.query;

    const filter = artistId ? { artists: artistId } : {};

    const albums = await Album.find(filter).populate('artists');
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artists');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAlbum = async (req, res) => {
  try {
    const album = new Album(req.body);
    const savedAlbum = await album.save();
    res.status(201).json(savedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlbumsByWeather = async (req, res) => {
  try {
    const weather = req.query.weather;
    if (!weather) {
      return res.status(400).json({ error: 'Missing weather query parameter' });
    }

    const albums = await Album.find({ weatherCondition: weather.toLowerCase() }).populate('artists');
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};