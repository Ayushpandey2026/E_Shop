import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // 👈 import useAuth
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "./CartSlice";
import "../style/LoginPage.css";

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUser } = useAuth();  // 👈 context se setUser le liya

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("https://e-shop-backend-iqb1.onrender.com/api/web/auth/login", formData);

    const { token, user } = res.data;

    // ✅ Store auth data
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);

    setUser(user); // ✅ Update context or state

    // Dispatch fetchCart after login to update cart count
    dispatch(fetchCart(token));

    // ✅ Redirect based on role
    if (user.role === "admin") {
      console.log("role",user.role);
      navigate("/admin"); 
    } else {
      navigate("/"); 
    }

  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
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
