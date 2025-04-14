const Album = require('../models/Album');

// Lấy tất cả album, có artist details
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('artists');
    res.status(200).json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy 1 album theo id
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artists');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.status(200).json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới album
exports.createAlbum = async (req, res) => {
  try {
    const album = new Album(req.body);
    const savedAlbum = await album.save();
    res.status(201).json(savedAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật album
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

// Xóa album
exports.deleteAlbum = async (req, res) => {
  try {
    await Album.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
