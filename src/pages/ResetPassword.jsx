// pages/ResetPassword.jsx
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const  ResetPassword=()=> {
  const [newPassword, setNewPassword] = useState("");
  const { token } = useParams();
  console.log("Reset Password Token:", token);
  

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:8000/api/web/auth/reset-password/${token}`, {
        password: newPassword,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <label>
          New Password:
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Reset Password
        </button>
      </form>
    </div>
  );
}


// Styling
const containerStyle = {
  maxWidth: "400px",
  margin: "auto",
  padding: "20px",
};

const inputStyle = {
  width: "100%",
  marginTop: "5px",
  padding: "8px",
};

const buttonStyle = {
  marginTop: "15px",
  padding: "10px 20px",
  background: "green",
  color: "white",
  border: "none",
  cursor: "pointer",
};
