const mongoose = require('mongoose')

const goalTaskSchema = new mongoose.Schema({
  task_id: {
    type: Number,
    required: true,
    unique: true
  },
  task_name: {
    type: String,
    required: true
  },
  goal_id: {
    type: Number,
    required: true
  },
  user_id: {
    type: Number,
    required: true
  },
  task_detail: {
    type: String,
    required: false
  },
  status: {
    type: Number,
    required: true,
    default: 0
  },
  due_date: {
    type: Date,
    required: false
  },
  start_time: {
    type: String,
    required: false
  },
  end_time: {
    type: String,
    required: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Goal_Task', goalTaskSchema)