import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { queryService } from '../services';

const ProfilePage = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await queryService.getStats();
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (authLoading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="loading__spinner"></div>
        </div>
      </div>
    );
  }

  const getInitials = (username) => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <div className="profile">
      <div className="profile__header">
        <div className="profile__user-info">
          <div className="profile__avatar">
            {getInitials(user?.username)}
          </div>
          <div>
            <h1 className="profile__name">{user?.username}</h1>
            <p className="profile__email">{user?.email}</p>
          </div>
        </div>

        {stats && (
          <div className="profile__stats">
            <div className="profile__stat">
              <div className="profile__stat-value">{stats.totalAttempts}</div>
              <div className="profile__stat-label">Queries</div>
            </div>
            <div className="profile__stat">
              <div className="profile__stat-value">{stats.successRate}%</div>
              <div className="profile__stat-label">Success</div>
            </div>
            <div className="profile__stat">
              <div className="profile__stat-value">{stats.assignmentsAttempted}</div>
              <div className="profile__stat-label">Assignments</div>
            </div>
          </div>
        )}
      </div>

      <div className="profile__section">
        <h2 className="profile__section-title">Your Statistics</h2>
        
        {loading ? (
          <div className="loading">
            <div className="loading__spinner"></div>
          </div>
        ) : stats ? (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Total Query Attempts</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: 0 }}>{stats.totalAttempts}</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Successful Queries</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#28a745', marginBottom: 0 }}>{stats.successfulAttempts}</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Success Rate</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: 0 }}>{stats.successRate}%</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.5rem' }}>Avg Execution Time</h3>
              <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1e3a5f', marginBottom: 0 }}>{stats.avgExecutionTime}ms</p>
            </div>
          </div>
        ) : (
          <div className="message message--info">
            Start solving assignments to see your statistics here!
          </div>
        )}
      </div>

      <div className="profile__section" style={{ marginTop: '1.5rem' }}>
        <h2 className="profile__section-title">Recent Activity</h2>
        <div className="card">
          <p style={{ color: '#6c757d', marginBottom: 0 }}>
            Keep practicing SQL queries to build your skills and track your progress here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
