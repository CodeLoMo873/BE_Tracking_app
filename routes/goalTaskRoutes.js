const express = require('express')
const router = express.Router()
const goalTaskController = require('../controllers/goalTaskController')

// Get all tasks
router.get('/all', goalTaskController.getAllTasks)

// Get task by ID
router.get('/:task_id', goalTaskController.getTaskById)

// Get tasks by goal ID
router.get('/goal/:goal_id', goalTaskController.getTasksByGoalId)

// Get tasks by user ID
router.get('/user/:user_id', goalTaskController.getTasksByUserId)

// Create new task
router.post('/create', goalTaskController.createTask)
// Update task
router.put('/:task_id', goalTaskController.updateTask)

// Delete task
router.delete('/:task_id', goalTaskController.deleteTask)

module.exports = router
