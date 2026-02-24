const { Assignment, QueryAttempt } = require('../models');
const { generateHint, generateFallbackHint } = require('../services/llmService');
const { asyncHandler } = require('../middleware/errorHandler');

const generateAssignmentHint = asyncHandler(async (req, res) => {
  const { assignmentId, currentQuery, errorMessage } = req.body;

  // Validate assignment exists
  const assignment = await Assignment.findById(assignmentId).select('-solutionQuery');
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  // Determine hint level based on previous attempts
  let hintLevel = 1;
  
  // If user has made attempts, potentially increase hint level
  if (req.user || req.body.sessionId) {
    const identifier = req.user 
      ? { userId: req.user._id } 
      : { sessionId: req.body.sessionId };
    
    const attempts = await QueryAttempt.getAttempts(identifier, assignmentId, 5);
    
    // Increase hint level based on failed attempts
    const failedAttempts = attempts.filter(a => !a.isSuccessful).length;
    if (failedAttempts >= 5) hintLevel = 3;
    else if (failedAttempts >= 2) hintLevel = 2;
  }

  // Allow manual hint level override (max 3)
  if (req.body.hintLevel) {
    hintLevel = Math.min(Math.max(parseInt(req.body.hintLevel), 1), 3);
  }

  try {
    // Try LLM-based hint first
    const hintResult = await generateHint(assignment, {
      currentQuery,
      errorMessage,
      hintLevel
    });

    // Update hints used count if tracking
    if (req.user || req.body.sessionId) {
      // Could increment hint counter here
    }

    res.json({
      success: true,
      data: {
        hint: hintResult.hint,
        level: hintLevel,
        source: hintResult.model
      }
    });
  } catch (error) {
    console.error('LLM hint generation failed:', error);
    
    // Fall back to built-in hints
    const fallbackResult = generateFallbackHint(assignment, hintLevel);
    
    res.json({
      success: true,
      data: {
        hint: fallbackResult.hint,
        level: hintLevel,
        source: 'fallback'
      }
    });
  }
});

const getInitialHint = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  const assignment = await Assignment.findById(assignmentId).select('hint title');
  
  if (!assignment) {
    return res.status(404).json({
      success: false,
      error: 'Assignment not found'
    });
  }

  res.json({
    success: true,
    data: {
      hint: assignment.hint || 'Think about which tables and columns you need to answer the question.',
      level: 0,
      source: 'builtin'
    }
  });
});

module.exports = {
  generateAssignmentHint,
  getInitialHint
};
