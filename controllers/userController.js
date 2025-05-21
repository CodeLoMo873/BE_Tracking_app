const User = require('../models/User')

// Add this function to your existing userController.js file

// Login user with user_code and pass_word
exports.loginUser = async (req, res) => {
  try {
    const { user_code, pass_word } = req.body

    // Validate input
    if (!user_code || !pass_word) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp mã người dùng và mật khẩu' 
      })
    }

    // Find user by user_code
    const user = await User.findOne({ user_code })

    // Check if user exists
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Không tìm thấy người dùng' 
      })
    }

    // Check password
    if (user.pass_word !== pass_word) {
      return res.status(401).json({ 
        success: false,
        message: 'Mật khẩu không chính xác' 
      })
    }

    // Return user information
    const userData = {
      user_name: user.user_name,
      user_code: user.user_code,
      pass_word: user.pass_word,
      email: user.email,
      phone_number: user.phone_number
    }

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: userData
    })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ 
      success: false,
      message: 'Lỗi đăng nhập',
      error: error.message 
    })
  }
}

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { user_name, user_code, pass_word, email, phone_number } = req.body

    // Validate input
    if (!user_name || !user_code || !pass_word) {
      return res.status(400).json({ 
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin bắt buộc (tên, mã người dùng, mật khẩu)' 
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ user_code })
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        message: 'Mã người dùng đã tồn tại' 
      })
    }

    // Create new user with ID
    const lastUser = await User.findOne().sort({ id: -1 });
    const newId = lastUser ? lastUser.id + 1 : 1;

    const newUser = new User({
      id: newId,
      user_name,
      user_code,
      pass_word,
      email,
      phone_number
    })

    await newUser.save()

    // Return user information
    const userResponse = {
      id: newUser.id,
      user_name: newUser.user_name,
      user_code: newUser.user_code,
      email: newUser.email,
      phone_number: newUser.phone_number
    }

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: userResponse
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ 
      success: false,
      message: 'Lỗi đăng ký người dùng',
      error: error.message 
    })
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

// Update user information
exports.updateUser = async (req, res) => {
  try {
    const { user_code } = req.params;
    const updateData = req.body;

    // Find user by user_code and update
    const updatedUser = await User.findOneAndUpdate(
      { user_code },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật thông tin người dùng thành công',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi cập nhật người dùng',
      error: error.message
    });
  }
}