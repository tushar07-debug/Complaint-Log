import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, pwd : password })
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
console.log("hello");

    
      const data = await response.json();
     

      if (!data) {
     
        throw new Error("Token not found in response headers");
      }

  
      document.cookie = `token=${data.accessToken}; path=/`;
 
      if(data.isAdmin){
        navigate("/Admin")
      }
      
      else{
      navigate("/Dashboard");
    }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="addUser">
      <h3>Log in</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <form className="addUserForm" onSubmit={handleSubmit}>
        <div className="inputGroup">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="off"
            placeholder="Enter your Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            placeholder="Enter your Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
      </form>
      <div className="login">
        <p>Don't have Account? </p>
        <Link to="/Signup" className="btn btn-success">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Login;
