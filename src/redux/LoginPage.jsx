import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const LoginPage=()=>{
    const [email,setEmail]=useState("");

    const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email) {
      login();            // set isLoggedIn = true
      navigate("/cart");  // redirect to cart
    }
  };
    return(
        <>
            <div className="cart-page">
                <h1>Login </h1>
                <form  className="login-form" onSubmit={handleLogin} >
                    <div className="form-data">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" 
                        placeholder="Enter your email" required
                        onChange={(e)=>{setEmail(e.target.value)}
                        }   
                        />
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" placeholder="Enter your password" required/>
                        <button type="submit" className="submit">Login</button> 
                        <p>Don't have an account? <a href="/signup">Sign Up</a></p>
                        <p>Forgot Password? <a href="/forgot-password">Reset</a></p>
                        </div>
                </form>
            </div>
        </>
    )
}