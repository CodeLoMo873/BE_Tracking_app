const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  user_name: {
    type: String,
    required: true
  },
  user_code: {
    type: String,
    required: true,
    unique: true
  },
  pass_word: {
    type: String,
    required: true
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
