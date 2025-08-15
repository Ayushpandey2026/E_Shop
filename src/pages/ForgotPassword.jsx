// pages/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

export const  ForgotPassword=()=> {
  const [email, setEmail] = useState("");

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/web/auth/forgot-password", { email });

      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgot}>
        <label>
          Email:
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <button type="submit" style={buttonStyle}>
          Send Reset Link
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
  background: "blue",
  color: "white",
  border: "none",
  cursor: "pointer",
};
