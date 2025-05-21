const GoalTask = require('../models/GoalTask')

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await GoalTask.find({})
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    })
  } catch (error) {
    console.error('Error fetching all tasks:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách công việc',
      error: error.message
    })
  }
}

// Get task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { task_id } = req.params
    const taskId = parseInt(task_id)
    
    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'task_id phải là một số'
      })
    }
    
    const task = await GoalTask.findOne({ task_id: taskId })
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc'
      })
    }
    
    res.status(200).json({
      success: true,
      data: task
    })
  } catch (error) {
    console.error('Error fetching task by ID:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể lấy thông tin công việc',
      error: error.message
    })
  }
}

// Get tasks by goal ID
exports.getTasksByGoalId = async (req, res) => {
  try {
    const { goal_id } = req.params
    const goalId = parseInt(goal_id)
    
    if (isNaN(goalId)) {
      return res.status(400).json({
        success: false,
        message: 'goal_id phải là một số'
      })
    }
    
    const tasks = await GoalTask.find({ goal_id: goalId })
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    })
  } catch (error) {
    console.error('Error fetching tasks by goal ID:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách công việc theo mục tiêu',
      error: error.message
    })
  }
}

// Get tasks by user ID
exports.getTasksByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userId = parseInt(user_id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: 'user_id phải là một số'
      });
    }
    const tasks = await GoalTask.find({ user_id: userId });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách công việc theo user_id',
      error: error.message
    });
  }
}

// Placeholder functions for other routes
// Create new task
exports.createTask = async (req, res) => {
  try {
    const { task_id, task_name, goal_id, task_detail, due_date, end_time, start_time } = req.body

    // Validate required fields
    if (!task_id || !task_name || !goal_id) {
      return res.status(400).json({
        success: false,
        message: 'task_id, task_name, and goal_id are required'
      })
    }

    // Check for duplicate task_id
    const existingTask = await GoalTask.findOne({ task_id })
    if (existingTask) {
      return res.status(409).json({
        success: false,
        message: 'task_id already exists'
      })
    }

    const newTask = new GoalTask({
      task_id,
      task_name,
      goal_id,
      task_detail,
      status: 0, // default value
      due_date,
      end_time,
      start_time,
      user_id: 1, // default value
    })

    await newTask.save()

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask
    })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: error.message
    })
  }
}

exports.updateTask = async (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' })
}

exports.deleteTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const taskId = parseInt(task_id);

    if (isNaN(taskId)) {
      return res.status(400).json({
        success: false,
        message: 'task_id phải là một số'
      });
    }

    const deletedTask = await GoalTask.findOneAndDelete({ task_id: taskId });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy công việc để xoá'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Xoá công việc thành công',
      data: deletedTask
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi xoá công việc',
      error: error.message
    });
  }
}