const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const cors = require('cors')

const app = express()
app.use(cors())

app.use(express.urlencoded({ extended: true }))

// Middleware to parse JSON bodies
app.use(express.json()) // This is duplicated below - we'll fix that

const PORT = process.env.PORT || 3000
const User = require('./models/User')
const userRoutes = require('./routes/userRoutes')

// Check if these files exist before requiring them
try {
  const goalRoutes = require('./routes/goalRoutes')
  const goalTypeRoutes = require('./routes/goalTypeRoutes')
  const goalTaskRoutes = require('./routes/goalTaskRoutes')
  
  // Register routes only if they exist
  app.use('/api/goals', goalRoutes)
  app.use('/api/goal-types', goalTypeRoutes)
  app.use('/api/tasks', goalTaskRoutes)
} catch (error) {
  console.error('Error loading routes:', error.message)
}

// Only keeping the user routes
app.use('/api/user', userRoutes)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

// Routes
app.get('/', (req, res) => {
  res.send('Express + MongoDB Backend!')
})

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`)
})
