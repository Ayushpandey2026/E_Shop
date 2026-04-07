import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.jsx";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import "../style/Signup.css";

export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/signup", formData);

      const { token, user } = response.data;

      if (token && user) {
        // Use context functions instead of localStorage
        setToken(token);
        setUser(user);

        Swal.fire({
          icon: "success",
          title: "Signup Successful!",
          text: `Welcome, ${user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: "Missing token or user data",
        });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: errorMessage,
      });
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
            name="name"
            id="name"
            placeholder="Enter your name"
            required
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">Sign Up</button>

          <p>Already have an account? <a href="/login">Log in</a></p>
        </div>
      </form>
    </div>
  );
};

