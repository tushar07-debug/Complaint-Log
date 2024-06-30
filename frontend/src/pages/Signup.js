import React, { useState } from "react";
import "./Signup.css";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    reenterPassword: "",
    role: ""  
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password, reenterPassword, role } = formData;

    if (password !== reenterPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include at least one number, one capital letter, and one special character.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/Registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, pwd : password, isAdmin : role === "admin" })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="addUser">
      <h3>Sign Up</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="addUserForm" onSubmit={handleSignup}>
        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Enter your username"
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Enter your Email"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Enter Password"
            required
          />
          <label htmlFor="reenterPassword">Re-enter Password:</label>
          <input
            type="password"
            id="reenterPassword"
            name="reenterPassword"
            value={formData.reenterPassword}
            onChange={handleInputChange}
            autoComplete="off"
            placeholder="Re-enter Password"
            required
          />
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Role</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="btn btn-success">
            Sign Up
          </button>
        </div>
      </form>
      <div className="login">
        <p>Already have an Account? </p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
