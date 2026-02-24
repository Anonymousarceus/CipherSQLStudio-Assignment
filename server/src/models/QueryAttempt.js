const mongoose = require('mongoose');

const queryAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: false
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true
  },
  query: {
    type: String,
    required: [true, 'Query is required'],
    trim: true,
    maxlength: [10000, 'Query cannot exceed 10000 characters']
  },
  isSuccessful: {
    type: Boolean,
    default: false
  },
  executionTime: {
    type: Number,
    default: 0
  },
  rowCount: {
    type: Number,
    default: 0
  },
  errorMessage: {
    type: String,
    default: null
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  hintsUsed: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient queries
queryAttemptSchema.index({ user: 1, assignment: 1 });
queryAttemptSchema.index({ sessionId: 1, assignment: 1 });
queryAttemptSchema.index({ createdAt: -1 });

// Static method to get attempts by user/session and assignment
queryAttemptSchema.statics.getAttempts = async function(identifier, assignmentId, limit = 10) {
  const query = { assignment: assignmentId };
  
  if (identifier.userId) {
    query.user = identifier.userId;
  } else if (identifier.sessionId) {
    query.sessionId = identifier.sessionId;
  }
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('query isSuccessful executionTime rowCount errorMessage createdAt');
};

const QueryAttempt = mongoose.model('QueryAttempt', queryAttemptSchema);

module.exports = QueryAttempt;
