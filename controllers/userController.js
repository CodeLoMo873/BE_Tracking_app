const User = require('../models/User')

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { user_code, pass_word } = req.body

    // Validate input
    if (!user_code || !pass_word) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp mã người dùng và mật khẩu' 
      })
    }

    // Find user by user_code
    const user = await User.findOne({ user_code })

    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        message: 'Không tìm thấy người dùng' 
      })
    }

    // Check password
    if (user.pass_word !== pass_word) {
      return res.status(401).json({ 
        message: 'Mật khẩu không chính xác' 
      })
    }

    // Return user information (excluding password)
    const userResponse = {
      user_name: user.user_name,
      user_code: user.user_code,
      _id: user._id
    }

    res.status(200).json(userResponse)
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: error.message })
  }
}

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { user_name, user_code, pass_word } = req.body

    // Validate input
    if (!user_name || !user_code || !pass_word) {
      return res.status(400).json({ 
        message: 'Vui lòng cung cấp đầy đủ thông tin người dùng' 
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ user_code })
    if (existingUser) {
      return res.status(409).json({ 
        message: 'Mã người dùng đã tồn tại' 
      })
    }

    // Create new user
    const newUser = new User({
      user_name,
      user_code,
      pass_word
    })

    await newUser.save()

    // Return user information (excluding password)
    const userResponse = {
      user_name: newUser.user_name,
      user_code: newUser.user_code,
      _id: newUser._id
    }

    res.status(201).json(userResponse)
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ message: error.message })
  }
}

// Get all users (for admin purposes)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users from database, excluding password field for security
    const users = await User.find({})
    console.log(users);
    
    // Return the list of users
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ 
      success: false,
      message: 'Không thể lấy danh sách người dùng',
      error: error.message 
    })
  }
}