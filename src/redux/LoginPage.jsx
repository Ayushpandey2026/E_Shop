import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin =async (e) => {
    e.preventDefault();
   try{
    const response =await axios.post("http://localhost:8000/api/web/auth/login", {
      email,
      password,
    });
        console.log("Login success:", response.data); // Debug log
    login(response.data.token);
    navigate("/cart");
   }
   catch (error) {
    if(error.response && error.response.data && error.response.data.message){
    alert(error.response.data.message);
   }
  }
  };

  return (
    <div className="cart-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Login</h1>
        <div className="form-data">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            onChange={(e)=>setPassword(e.target.value)}
          />

          <button type="submit" className="submit">Login</button>

          <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      </form>
    </div>
  );
};
