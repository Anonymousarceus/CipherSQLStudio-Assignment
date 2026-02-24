const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById,
  getAssignmentCategories,
  createAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect, adminOnly } = require('../middleware/auth');
const { mongoIdValidation } = require('../middleware/validation');

router.get('/', getAllAssignments);
router.get('/categories', getAssignmentCategories);
router.get('/:id', mongoIdValidation, getAssignmentById);

router.post('/', protect, adminOnly, createAssignment);
router.put('/:id', protect, adminOnly, mongoIdValidation, updateAssignment);
router.delete('/:id', protect, adminOnly, mongoIdValidation, deleteAssignment);

module.exports = router;
