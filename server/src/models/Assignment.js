const mongoose = require('mongoose');

const tableSchemaDefinition = new mongoose.Schema({
  tableName: {
    type: String,
    required: true
  },
  columns: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    constraints: {
      type: String,
      default: ''
    }
  }],
  sampleDataQuery: {
    type: String,
    required: true
  }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true,
    default: 'easy'
  },
  category: {
    type: String,
    enum: ['SELECT', 'JOIN', 'AGGREGATE', 'SUBQUERY', 'DML', 'MIXED'],
    default: 'SELECT'
  },
  question: {
    type: String,
    required: [true, 'Assignment question is required']
  },
  hint: {
    type: String,
    default: ''
  },
  tables: [tableSchemaDefinition],
  expectedOutputDescription: {
    type: String,
    required: true
  },
  solutionQuery: {
    type: String,
    required: true,
    select: false
  },
  points: {
    type: Number,
    default: 10,
    min: 1,
    max: 100
  },
  timeEstimate: {
    type: String,
    default: '10-15 minutes'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
assignmentSchema.index({ difficulty: 1, category: 1 });
assignmentSchema.index({ isActive: 1, order: 1 });

// Virtual for table count
assignmentSchema.virtual('tableCount').get(function() {
  return this.tables ? this.tables.length : 0;
});

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
