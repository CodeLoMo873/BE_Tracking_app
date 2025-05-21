const mongoose = require('mongoose')

const goalTypeSchema = new mongoose.Schema({
  goal_type_id: {
    type: Number,
    required: true,
    unique: true
  },
  goal_type_name: {
    type: String,
    required: true
  },
  goal_type_icon: {
    type: String,
    required: true
  },
  goal_type_color: {
    type: String,
    required: true
  },
  icon_type: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Goal_Type', goalTypeSchema)