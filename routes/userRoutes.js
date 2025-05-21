const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Get all users
router.get('/all', userController.getAllUsers)

// Register user
router.post('/reg', userController.registerUser)

// Login user
router.post('/login', userController.loginUser)

// Update user information by user_code
router.put('/update/:user_code', userController.updateUser)

module.exports = router