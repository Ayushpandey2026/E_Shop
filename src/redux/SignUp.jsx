import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/web/auth/signup", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token); // Assuming token is returned
      alert("Signup successful!");
      console.log("Signup successful:navigating to cart");
      
      navigate("/product"); 
    } catch (error) {
        
     if(error.response && error.response.data && error.response.data.message){
        alert("user already exist")
     }else{
        alert("something went wrong");
     }
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSignUp}>
        <h1>Create Account</h1>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            required
            onChange={(e) => setName(e.target.value)}
          />

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
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="submit-btn">Sign Up</button>

          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </form>
    </div>
  );
};
