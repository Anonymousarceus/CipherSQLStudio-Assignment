const { Assignment } = require('../models');
const { getTableInfo } = require('../services/queryService');
const { asyncHandler } = require('../middleware/errorHandler');

const getAllAssignments = asyncHandler(async (req, res) => {
  const { difficulty, category, page = 1, limit = 20 } = req.query;

  // Build filter
  const filter = { isActive: true };
  if (difficulty) filter.difficulty = difficulty;
  if (category) filter.category = category;

  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Get assignments (without solution)
  const assignments = await Assignment.find(filter)
    .select('-solutionQuery')
    .sort({ order: 1, difficulty: 1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Get total count
  const total = await Assignment.countDocuments(filter);

  res.json({
    success: true,
    data: {
      assignments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id)
    .select('-solutionQuery');

  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  // Fetch sample data for each table from PostgreSQL
  const tablesWithData = await Promise.all(
    assignment.tables.map(async (table) => {
      const tableInfo = await getTableInfo(table.tableName, 5);
      return {
        ...table.toObject(),
        sampleData: tableInfo.success ? tableInfo.sampleData : [],
        schemaInfo: tableInfo.success ? tableInfo.columns : []
      };
    })
  );

  res.json({
    success: true,
    data: {
      assignment: {
        ...assignment.toObject(),
        tables: tablesWithData
      }
    }
  });
});

const getAssignmentCategories = asyncHandler(async (req, res) => {
  const categories = await Assignment.aggregate([
    { $match: { isActive: true } },
    { 
      $group: { 
        _id: '$category', 
        count: { $sum: 1 },
        difficulties: { $push: '$difficulty' }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        easyCount: {
          $size: {
            $filter: {
              input: '$difficulties',
              as: 'diff',
              cond: { $eq: ['$$diff', 'easy'] }
            }
          }
        },
        mediumCount: {
          $size: {
            $filter: {
              input: '$difficulties',
              as: 'diff',
              cond: { $eq: ['$$diff', 'medium'] }
            }
          }
        },
        hardCount: {
          $size: {
            $filter: {
              input: '$difficulties',
              as: 'diff',
              cond: { $eq: ['$$diff', 'hard'] }
            }
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: { categories }
  });
});

const createAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.create(req.body);

  res.status(201).json({
    success: true,
    data: { assignment }
  });
});

const updateAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-solutionQuery');

  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  res.json({
    success: true,
    data: { assignment }
  });
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);

  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  res.json({
    success: true,
    message: 'Assignment deleted successfully'
  });
});

module.exports = {
  getAllAssignments,
  getAssignmentById,
  getAssignmentCategories,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
