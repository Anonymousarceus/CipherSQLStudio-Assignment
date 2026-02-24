const { QueryAttempt, Assignment } = require('../models');
const { executeQuery, validateQuery } = require('../services/queryService');
const { asyncHandler } = require('../middleware/errorHandler');

const executeUserQuery = asyncHandler(async (req, res) => {
  const { query, assignmentId, sessionId } = req.body;

  // Validate assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  // Execute the query
  const result = await executeQuery(query);

  // Save attempt to database
  const attemptData = {
    assignment: assignmentId,
    query,
    isSuccessful: result.success,
    executionTime: result.executionTime,
    rowCount: result.rowCount,
    errorMessage: result.error || null,
    result: result.success ? result.rows.slice(0, 10) : null // Store first 10 rows
  };

  // Associate with user if authenticated, otherwise use session
  if (req.user) {
    attemptData.user = req.user._id;
  } else if (sessionId) {
    attemptData.sessionId = sessionId;
  }

  // Save attempt (fire and forget for performance)
  QueryAttempt.create(attemptData).catch(err => {
    console.error('Failed to save query attempt:', err);
  });

  res.json({
    success: true,
    data: {
      querySuccess: result.success,
      rows: result.rows,
      columns: result.columns,
      rowCount: result.rowCount,
      totalCount: result.totalCount,
      executionTime: result.executionTime,
      truncated: result.truncated,
      message: result.message,
      error: result.error
    }
  });
});

const validateUserQuery = asyncHandler(async (req, res) => {
  const { query } = req.body;

  const validation = validateQuery(query);

  res.json({
    success: true,
    data: {
      valid: validation.valid,
      error: validation.error || null
    }
  });
});

const getQueryHistory = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { sessionId } = req.query;
  const limit = parseInt(req.query.limit) || 10;

  // Validate assignment exists
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  // Build query based on authentication
  let identifier = {};
  if (req.user) {
    identifier.userId = req.user._id;
  } else if (sessionId) {
    identifier.sessionId = sessionId;
  } else {
    return res.status(400).json({
      success: false,
      error: 'Either authentication or sessionId is required'
    });
  }

  const attempts = await QueryAttempt.getAttempts(identifier, assignmentId, limit);

  res.json({
    success: true,
    data: {
      attempts,
      count: attempts.length
    }
  });
});

const getQueryStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await QueryAttempt.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        successfulAttempts: {
          $sum: { $cond: ['$isSuccessful', 1, 0] }
        },
        avgExecutionTime: { $avg: '$executionTime' },
        uniqueAssignments: { $addToSet: '$assignment' }
      }
    },
    {
      $project: {
        totalAttempts: 1,
        successfulAttempts: 1,
        successRate: {
          $round: [
            { $multiply: [{ $divide: ['$successfulAttempts', '$totalAttempts'] }, 100] },
            2
          ]
        },
        avgExecutionTime: { $round: ['$avgExecutionTime', 2] },
        assignmentsAttempted: { $size: '$uniqueAssignments' }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      stats: stats[0] || {
        totalAttempts: 0,
        successfulAttempts: 0,
        successRate: 0,
        avgExecutionTime: 0,
        assignmentsAttempted: 0
      }
    }
  });
});

module.exports = {
  executeUserQuery,
  validateUserQuery,
  getQueryHistory,
  getQueryStats
};
