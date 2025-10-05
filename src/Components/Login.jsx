import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'
import NavLog from '../assets/Banner.png'
// import { Link } from 'react-router-dom';
import NavBar from './NavBar.jsx'

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check if user exists
    const existingUser = users.find(
      user => user.email === formData.email && user.password === formData.password
    );

    if (existingUser) {
      // Save logged-in user to localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(existingUser));
      alert("Login successful!");
      navigate("/"); // redirect to homepage
    } else {
      alert("Invalid email or password!");
    }
  };

  return (

    <div className="root">

    <div className="navbar-fixed" style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                zIndex: "1000"
            }}>

                <NavBar />
            </div>
    <div className="container">
      
      
       <div className="login-banner">
        <div>
          <h2>Login</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>
        <div className="login-illustration">
          {/* Replace with your imported image */}
          <img src={NavLog} alt="Login illustration" />
        </div>
      </div>

      <div className="form-section">

      <form onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          
          <input
            type="email"
            className="form-input"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          
          <input
            type="password"
            className="form-password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <p className="terms-text">
            By continuing, you agree to Flipkart's{" "}
            <a href="/terms">Terms of Use</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

        <button type="submit" className="btn-login">
          Login
        </button>
      </form>
      <div className="create-account">
          <a href="/signup">New to Flipkart? Create an account</a>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
