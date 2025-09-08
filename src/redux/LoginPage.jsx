import React, { useState } from "react";
import axios from "axios";
import "../style/LoginPage.css"
import { useNavigate, Link } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { resetCart } from "../redux/CartSlice";

// For example in logout handler:
// dispatch(resetCart());


export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/web/auth/login", {
        email,
        password,
      });

      // ✅ Token ko localStorage me save karna
      localStorage.setItem("token", res.data.token);

      // alert("Login Successful!");
      navigate("/"); // dashboard/home par bhejo
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="login-container">
    <form onSubmit={handleLogin} className="login-form">
      <h2>Login</h2>

      {error && <p className="error-message">{error}</p>}

      <div className="input-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="input-group">
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="login-button">
        Login
      </button>

      <div className="login-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/signup">Create Account</Link>
      </div>
    </form>
  </div>
);
}