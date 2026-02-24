const express = require('express');
const router = express.Router();
const {
  executeUserQuery,
  validateUserQuery,
  getQueryHistory,
  getQueryStats
} = require('../controllers/queryController');
const { optionalAuth, protect } = require('../middleware/auth');
const { queryValidation, mongoIdValidation } = require('../middleware/validation');

router.post('/execute', optionalAuth, queryValidation, executeUserQuery);

router.post('/validate', validateUserQuery);

router.get('/history/:assignmentId', optionalAuth, mongoIdValidation, getQueryHistory);

router.get('/stats', protect, getQueryStats);

module.exports = router;
