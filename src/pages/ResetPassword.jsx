// pages/ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../style/ResetPassword.css"; // ✅ Import CSS

export const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/auth/reset-password/${token}`, {
        password: newPassword,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleReset}>
        <h2 className="auth-title">🔐 Reset Password</h2>
        
        <div className="form-group">
          <label>New Password</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>

        <button type="submit" className="submit-btn">Reset Password</button>
      </form>
    </div>
  );
};
