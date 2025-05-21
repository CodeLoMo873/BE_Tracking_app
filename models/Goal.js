const mongoose = require('mongoose')

const goalSchema = new mongoose.Schema({
  goal_id: {
    type: Number,
    required: true,
    unique: true
  },
  user_id: {
    type: Number,
    required: true
  },
  goal_type_id: {
    type: Number,
    required: true
  },
  goal_name: {
    type: String,
    required: true
  },
  goal_detail: {
    type: String,
    required: true
  },
  start_date: {
    type: Date,
    required: false
  },
  end_date: {
    type: Date,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Goal', goalSchema)