import React, { useState, useEffect } from "react";
import './SignUp.css'
import NavLog from '../assets/Banner.png'
import NavBar from "./NavBar";
function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(savedUsers);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (users.some(u => u.email === formData.email)) {
      alert("User with this email already exists!");
      return;
    }

    const newUsers = [...users, formData];
    setUsers(newUsers);
    localStorage.setItem("users", JSON.stringify(newUsers));
    console.log("Updated users:", JSON.stringify(newUsers));

    alert("User registered successfully!");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: ""
    });
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
          <h2>Register</h2>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>
        <div className="login-illustration">
          {/* Replace with your imported image */}
          <img src={NavLog} alt="Login illustration" />
        </div>
      </div>

      <div className="form-section">

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          
          <input type="text" className="form-input" placeholder="Enter Full Name" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          {/* <label className="form-label">Email address</label> */}
          <input type="email" placeholder="Enter Email Address" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          {/* <label className="form-label">Phone Number</label> */}
          <input type="text" placeholder="Enter Phone Number" className="form-input" name="phone" value={formData.phone} onChange={handleChange} />
        </div>

        <div className="mb-3">
          {/* <label className="form-label">Password</label> */}
          <input type="password" placeholder="Enter Password" className="form-input" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div className="mb-3">
          {/* <label className="form-label">Confirm Password</label> */}
          <input type="password" placeholder="Confirm Password" className="form-input" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <p className="terms-text">
            By continuing, you agree to Flipkart's{" "}
            <a href="/terms">Terms of Use</a> and{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

        <button type="submit" className="btn btn-login">Sign Up</button>
      </form>
      <div className="create-account">
          <a href="/login">Already Have An Account? Login Here</a>
        </div>
      </div>

    </div>
  </div>
  );
}

export default SignUp;