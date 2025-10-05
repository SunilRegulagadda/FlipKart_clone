import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <p>
        This is a Page of Flipkart Clone developed by{" "}
        <b><ul>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          </ul></b> as a part of Holidays Project.
      </p>
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
    </footer>
  );
}

export default Footer;
