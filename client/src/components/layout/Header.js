import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header__container">
          <Link to="/" className="header__logo">
            <svg className="header__logo-icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#4ecdc4"/>
              <path d="M10 15h20M10 20h20M10 25h14" stroke="#1e3a5f" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="30" cy="28" r="6" fill="#1e3a5f"/>
              <path d="M28 28l2 2 3-4" stroke="#4ecdc4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="header__logo-text">CipherSQLStudio</span>
          </Link>

          <nav className="header__nav">
            <Link 
              to="/" 
              className={`header__nav-link ${isActive('/') ? 'header__nav-link--active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/assignments" 
              className={`header__nav-link ${isActive('/assignments') ? 'header__nav-link--active' : ''}`}
            >
              Assignments
            </Link>
            {isAuthenticated && (
              <Link 
                to="/profile" 
                className={`header__nav-link ${isActive('/profile') ? 'header__nav-link--active' : ''}`}
              >
                Profile
              </Link>
            )}
          </nav>

          <div className="header__actions">
            {isAuthenticated ? (
              <>
                <span className="header__nav-link" style={{ cursor: 'default' }}>
                  {user?.username}
                </span>
                <button className="btn btn--outline btn--sm" onClick={logout} style={{ color: 'white', borderColor: 'white' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm" style={{ color: 'white' }}>
                  Login
                </Link>
                <Link to="/register" className="btn btn--secondary btn--sm">
                  Sign Up
                </Link>
              </>
            )}
            
            <button className="header__mobile-menu-btn" onClick={toggleMobileMenu} aria-label="Toggle menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round"/>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-nav ${mobileMenuOpen ? 'mobile-nav--open' : ''}`} onClick={closeMobileMenu}>
        <div className="mobile-nav__panel" onClick={(e) => e.stopPropagation()}>
          <button className="mobile-nav__close" onClick={closeMobileMenu} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <nav className="mobile-nav__links">
            <Link to="/" className="mobile-nav__link" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link to="/assignments" className="mobile-nav__link" onClick={closeMobileMenu}>
              Assignments
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="mobile-nav__link" onClick={closeMobileMenu}>
                  Profile
                </Link>
                <button className="mobile-nav__link" onClick={() => { logout(); closeMobileMenu(); }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="mobile-nav__link" onClick={closeMobileMenu}>
                  Login
                </Link>
                <Link to="/register" className="mobile-nav__link" onClick={closeMobileMenu}>
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
