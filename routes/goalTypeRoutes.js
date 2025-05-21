const express = require('express')
const router = express.Router()
const goalTypeController = require('../controllers/goalTypeController')

// Get all goal types
router.get('/all', goalTypeController.getAllGoalTypes)

module.exports = router