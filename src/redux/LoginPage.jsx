import axiosInstance from "../utils/axiosInstance.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "./CartSlice";
import Swal from "sweetalert2";
import "../style/LoginPage.css";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user", // Default to user
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUser, setToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", formData);

      const { token, user } = res.data;

      if (token && user) {
        // Use context functions to update state
        setToken(token);
        setUser(user);

        // Fetch cart
        dispatch(fetchCart(token));

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        // Redirect based on role
        if (user.role === "admin") {
          navigate("/admin"); 
        } else {
          navigate("/"); 
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: "Missing token or user data",
        });
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">Login as User</option>
          <option value="admin">Login as Admin</option>
        </select>

        <button type="submit">Login</button>
      </form>

      <div className="login-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <span> | </span>
        <Link to="/signup">Don't have an account? Sign Up</Link>
      </div>
    </div>
  );
};

