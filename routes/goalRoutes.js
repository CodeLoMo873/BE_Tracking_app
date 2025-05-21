const express = require('express')
const router = express.Router()
const goalController = require('../controllers/goalController')
const goalTaskController = require('../controllers/goalTaskController')

// Get all goals
router.get('/all', goalController.getAllGoals)

// Get goals by type
router.get('/type/:goal_type_id', goalController.getGoalsByType)

// Get goals by type and user
router.get('/type/:goal_type_id/user/:user_id', goalController.getGoalsByTypeAndUser)

// Create new goal
router.post('/', goalController.createGoal)

// Get all tasks for a specific goal
router.get('/:goal_id/tasks', goalTaskController.getTasksByGoalId)

// Get all goals by user_id
router.get('/user/:user_id', goalController.getGoalsByUserId)

module.exports = router