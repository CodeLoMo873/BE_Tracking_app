const GoalType = require('../models/GoalType')

// Get all goal types
exports.getAllGoalTypes = async (req, res) => {
  try {
    // Fetch all goal types from database
    const goalTypes = await GoalType.find({}, {
      goal_type_id: 1,
      goal_type_name: 1,
      goal_type_icon: 1,
      goal_type_color: 1,
      icon_type: 1,
      _id: 0 // Exclude MongoDB's _id field
    })
    
    // Return the list of goal types
    res.status(200).json({
      success: true,
      count: goalTypes.length,
      data: goalTypes
    })
  } catch (error) {
    console.error('Error fetching goal types:', error)
    res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách loại mục tiêu',
      error: error.message
    })
  }
}

// Add sample goal types (for testing)
exports.addSampleGoalTypes = async (req, res) => {
  try {
    // Check if goal types already exist
    const existingGoalTypes = await GoalType.find({});
    if (existingGoalTypes.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Sample goal types already exist",
        count: existingGoalTypes.length,
        data: existingGoalTypes
      });
    }

    // Sample goal types data
    const sampleGoalTypes = [
      {
        goal_type_id: 1,
        goal_type_name: "Công việc",
        goal_type_icon: "briefcase",
        goal_type_color: "#4287f5",
        icon_type: "material"
      },
      {
        goal_type_id: 2,
        goal_type_name: "Học tập",
        goal_type_icon: "school",
        goal_type_color: "#42f5a7",
        icon_type: "material"
      },
      {
        goal_type_id: 3,
        goal_type_name: "Sức khỏe",
        goal_type_icon: "heart",
        goal_type_color: "#f54242",
        icon_type: "material"
      },
      {
        goal_type_id: 4,
        goal_type_name: "Tài chính",
        goal_type_icon: "attach-money",
        goal_type_color: "#f5d442",
        icon_type: "material"
      }
    ];

    // Insert sample goal types
    const insertedGoalTypes = await GoalType.insertMany(sampleGoalTypes);

    res.status(201).json({
      success: true,
      message: "Sample goal types added successfully",
      count: insertedGoalTypes.length,
      data: insertedGoalTypes
    });
  } catch (error) {
    console.error('Error adding sample goal types:', error);
    res.status(500).json({
      success: false,
      message: 'Không thể thêm dữ liệu mẫu loại mục tiêu',
      error: error.message
    });
  }
}