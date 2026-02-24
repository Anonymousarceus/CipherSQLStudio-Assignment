import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { assignmentService } from '../services';

const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await assignmentService.getAll();
      setAssignments(response.data.assignments);
      setError(null);
    } catch (err) {
      setError('Failed to load assignments. Please try again.');
      console.error('Error fetching assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    return assignment.difficulty === filter;
  });

  const getDifficultyClass = (difficulty) => {
    return `assignment-card__difficulty assignment-card__difficulty--${difficulty}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading__spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="message message--error">
          {error}
          <button className="btn btn--primary btn--sm" onClick={fetchAssignments} style={{ marginLeft: '1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="assignments">
        <div className="assignments__header">
          <h1 className="assignments__title">SQL Assignments</h1>
          <div className="assignments__filters">
            <button
              className={`assignments__filter-btn ${filter === 'all' ? 'assignments__filter-btn--active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`assignments__filter-btn ${filter === 'easy' ? 'assignments__filter-btn--active' : ''}`}
              onClick={() => setFilter('easy')}
            >
              Easy
            </button>
            <button
              className={`assignments__filter-btn ${filter === 'medium' ? 'assignments__filter-btn--active' : ''}`}
              onClick={() => setFilter('medium')}
            >
              Medium
            </button>
            <button
              className={`assignments__filter-btn ${filter === 'hard' ? 'assignments__filter-btn--active' : ''}`}
              onClick={() => setFilter('hard')}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="assignments__grid">
          {filteredAssignments.length === 0 ? (
            <div className="assignments__empty">
              <p>No assignments found.</p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => (
              <Link
                key={assignment._id}
                to={`/assignment/${assignment._id}`}
                className="assignment-card"
              >
                <div className="assignment-card__header">
                  <span className={getDifficultyClass(assignment.difficulty)}>
                    {assignment.difficulty}
                  </span>
                  <span className="assignment-card__category">
                    {assignment.category}
                  </span>
                </div>
                <h3 className="assignment-card__title">{assignment.title}</h3>
                <p className="assignment-card__description">{assignment.description}</p>
                <div className="assignment-card__footer">
                  <div className="assignment-card__meta">
                    <span className="assignment-card__meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      </svg>
                      {assignment.timeEstimate}
                    </span>
                    <span className="assignment-card__meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polygon points="12,2 15,8.5 22,9.3 17,14 18.2,21 12,17.8 5.8,21 7,14 2,9.3 9,8.5"/>
                      </svg>
                      {assignment.points} pts
                    </span>
                  </div>
                  <span className="assignment-card__meta-item">
                    {assignment.tableCount || assignment.tables?.length || 0} table{(assignment.tableCount || assignment.tables?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentsPage;
