import { useState } from "react";
import axios from "axios";
import "../style/ForgotPassword.css"; // CSS file

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://e-shop-backend-iqb1.onrender.com/api/web/auth/forgot-password", { email });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-password-container">
      <form className="forgot-password-form" onSubmit={handleForgot}>
        <h2>Forgot Password</h2>
        <p className="subtitle">Enter your registered email to receive a reset link.</p>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <button type="submit">Send Reset Link</button>
      </form>
    </div>
  );
};
