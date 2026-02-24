import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">
          &copy; {currentYear} CipherSQLStudio. Learn SQL interactively.
        </p>
        <div className="footer__links">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer__link"
          >
            GitHub
          </a>
          <span className="footer__link">Documentation</span>
          <span className="footer__link">Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
