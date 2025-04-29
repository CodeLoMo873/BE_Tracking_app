const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

// Get all users
router.get('/all', userController.getAllUsers)
router.get('/reg', userController.registerUser)

// Login route - user provides userName and password
router.post('/login', userController.loginUser)

// Other user routes can be added here

module.exports = router