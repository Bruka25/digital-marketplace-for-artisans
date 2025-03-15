import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      console.log("Login response:", response.data); // Log the response data for debugging
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      if (response.data.role === "Artisan") {
        navigate("/artisans"); // Redirect to Artisan Dashboard
      } else if (response.data.role === "Admin") {
        navigate("/admin"); // Redirect to admin page
      } else navigate("/products"); // Redirect to the products page
    } catch (error) {
      setError(
        error.response?.data?.error || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
