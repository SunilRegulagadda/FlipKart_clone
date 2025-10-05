import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-title">Flipkart Clone Project</p>
        <p className="footer-desc">
          Developed as part of the Holidays Project by:
        </p>
        <ul className="footer-team">
          <li>23A81A0501</li>
          <li>24A85A0506</li>
          <li>23A81A0534</li>
          <li>23A81A0536</li>
          <li>23A81A0553</li>
          <li>23A81A0539</li>
          <li>23A81A0559</li>
          <li>23A81A0515</li>
        </ul>

        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <i className="bi bi-instagram"></i>
          </a>
          <a href="mailto:someone@example.com">
            <i className="bi bi-envelope"></i>
          </a>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Flipkart Clone Project. All Rights Reserved.</p>
          <p>Made with HardWork by Team CSE</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
