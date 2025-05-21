const Goal = require('../models/Goal')

// Get all goals
exports.getAllGoals = async (req, res) => {
  try {
    const goals = await Goal.find({})
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách goals',
      error: error.message
    })
  }
}

// Get goals by goal_type_id
exports.getGoalsByType = async (req, res) => {
  try {
    const { goal_type_id } = req.params
    const typeId = parseInt(goal_type_id)
    if (isNaN(typeId)) {
      return res.status(400).json({
        success: false,
        message: 'goal_type_id phải là một số'
      })
    }
    const goals = await Goal.find({ goal_type_id: typeId })
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy goals theo loại',
      error: error.message
    })
  }
}

// Get goals by goal_type_id and user_id
exports.getGoalsByTypeAndUser = async (req, res) => {
  try {
    const { goal_type_id, user_id } = req.params
    const typeId = parseInt(goal_type_id)
    const userId = parseInt(user_id)
    if (isNaN(typeId) || isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'goal_type_id và user_id phải là số'
      })
    }
    const goals = await Goal.find({ goal_type_id: typeId, user_id: userId })
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy goals theo loại và user',
      error: error.message
    })
  }
}

// Get all goals by user_id
exports.getGoalsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userId = parseInt(user_id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'user_id phải là một số'
      });
    }
    const goals = await Goal.find({ user_id: userId });
    res.status(200).json({
      success: true,
      count: goals.length,
      data: goals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy goals theo user_id',
      error: error.message
    });
  }
}

// Create new goal
exports.createGoal = async (req, res) => {
  try {
    const { goal_id, user_id, goal_type_id, goal_name, goal_detail, start_date, end_date } = req.body

    // Validate required fields
    if (!goal_id || !user_id || !goal_type_id || !goal_name || !goal_detail) {
      return res.status(400).json({
        success: false,
        message: 'goal_id, user_id, goal_type_id, goal_name, goal_detail là bắt buộc'
      })
    }

    // Check for duplicate goal_id
    const existingGoal = await Goal.findOne({ goal_id })
    if (existingGoal) {
      return res.status(409).json({
        success: false,
        message: 'goal_id đã tồn tại'
      })
    }

    const newGoal = new Goal({
      goal_id,
      user_id,
      goal_type_id,
      goal_name,
      goal_detail,
      start_date,
      end_date
    })

    await newGoal.save()

    res.status(201).json({
      success: true,
      message: 'Tạo goal thành công',
      data: newGoal
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể tạo goal',
      error: error.message
    })
  }
}