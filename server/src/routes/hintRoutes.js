const express = require('express');
const router = express.Router();
const { generateAssignmentHint, getInitialHint } = require('../controllers/hintController');
const { optionalAuth } = require('../middleware/auth');
const { hintValidation, mongoIdValidation } = require('../middleware/validation');

router.get('/:assignmentId', mongoIdValidation, getInitialHint);

router.post('/generate', optionalAuth, hintValidation, generateAssignmentHint);

module.exports = router;
