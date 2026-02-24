import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home">
      <section className="home__hero">
        <div className="container">
          <h1 className="home__hero-title">Master SQL with Interactive Practice</h1>
          <p className="home__hero-subtitle">
            Practice SQL queries against real databases with instant feedback and intelligent hints. 
            No setup required — start learning now!
          </p>
          <div className="home__hero-actions">
            <Link to="/assignments" className="btn btn--secondary btn--lg">
              Start Practicing
            </Link>
            <Link to="/register" className="btn btn--outline btn--lg" style={{ borderColor: 'white', color: 'white' }}>
              Create Account
            </Link>
          </div>
        </div>
      </section>

      <section className="home__features">
        <div className="container">
          <h2 className="home__features-title">Why CipherSQLStudio?</h2>
          <div className="home__features-grid">
            <div className="card home__feature">
              <svg className="home__feature-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="3"/>
                <path d="M16 24h32M16 32h24M16 40h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 className="home__feature-title">Real SQL Execution</h3>
              <p className="home__feature-desc">
                Execute your queries against actual PostgreSQL databases. See real results instantly.
              </p>
            </div>

            <div className="card home__feature">
              <svg className="home__feature-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="3"/>
                <path d="M32 20v12l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              <h3 className="home__feature-title">Learn at Your Pace</h3>
              <p className="home__feature-desc">
                Choose from easy to hard assignments. Progress through topics at your own speed.
              </p>
            </div>

            <div className="card home__feature">
              <svg className="home__feature-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 8l6 18h18l-14 11 5 17-15-11-15 11 5-17-14-11h18z" stroke="currentColor" strokeWidth="3" fill="none"/>
              </svg>
              <h3 className="home__feature-title">AI-Powered Hints</h3>
              <p className="home__feature-desc">
                Stuck? Get intelligent hints that guide you without revealing the answer.
              </p>
            </div>

            <div className="card home__feature">
              <svg className="home__feature-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="8" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="3"/>
                <rect x="36" y="8" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="3"/>
                <rect x="8" y="36" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="3"/>
                <rect x="36" y="36" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="3"/>
              </svg>
              <h3 className="home__feature-title">Structured Curriculum</h3>
              <p className="home__feature-desc">
                From SELECT basics to complex JOINs and subqueries — learn SQL systematically.
              </p>
            </div>

            <div className="card home__feature">
              <svg className="home__feature-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 48l16-16 8 8 16-24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="home__feature-title">Track Progress</h3>
              <p className="home__feature-desc">
                Save your query attempts and track your learning journey over time.
              </p>
            </div>

            <div className="card home__feature">
              <svg className="home__feature-icon" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="8" width="24" height="48" rx="2" stroke="currentColor" strokeWidth="3"/>
                <rect x="36" y="16" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="3"/>
                <line x1="16" y1="48" x2="16" y2="48" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              <h3 className="home__feature-title">Mobile Friendly</h3>
              <p className="home__feature-desc">
                Practice SQL on any device — our responsive design works on phones and tablets too.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="container">
          <h2 className="home__cta-title">Ready to Start Learning?</h2>
          <p className="home__cta-text">
            Join thousands of students mastering SQL through hands-on practice.
          </p>
          <Link to="/assignments" className="btn btn--primary btn--lg">
            Browse Assignments
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
