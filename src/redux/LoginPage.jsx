import axiosInstance from "../utils/axiosInstance.jsx";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCart } from "./CartSlice";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Shield } from "lucide-react";


export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setUser, setToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      const { token, user } = res.data;

      if (token && user) {
        setToken(token);
        setUser(user);
        dispatch(fetchCart(token));

        Swal.fire({
          icon: "success",
          title: "Login Successful!",
          text: `Welcome back, ${user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });

        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      Swal.fire({
        icon: "error",
        title: "Login Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header with Gradient */}
          <div className="gradient-primary px-8 py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block"
            >
              <div className="p-3 bg-white rounded-full mb-4">
                <LogIn size={32} className="text-indigo-600" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
            <p className="text-indigo-100 font-semibold">Sign in to your account</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-indigo-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-all bg-slate-50 font-medium placeholder-slate-400"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Lock size={18} className="text-indigo-600" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-all bg-slate-50 font-medium placeholder-slate-400"
                />
              </motion.div>

              {/* Role Selector */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-indigo-600" />
                  Login As
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-all bg-slate-50 font-bold text-slate-900"
                >
                  <option value="user">👤 User</option>
                  <option value="admin">⚙️ Admin</option>
                </select>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      ⏳
                    </motion.span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </motion.button>

              {/* Forgot Password Link */}
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-indigo-600 hover:text-indigo-700 font-bold text-sm transition-colors underline underline-offset-2"
                >
                  Forgot your password?
                </Link>
              </div>
            </form>

            {/* Signup Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 pt-8 border-t border-slate-200 text-center"
            >
              <p className="text-slate-600 font-medium mb-4">
                Don't have an account?
              </p>
              <Link
                to="/signup"
                className="inline-block w-full bg-slate-100 hover:bg-slate-200 text-slate-900 font-black py-3 rounded-xl transition-all"
              >
                Create Account
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 font-semibold mt-8 text-sm"
        >
          Secure login with encrypted connection 🔒
        </motion.p>
      </motion.div>
    </div>
  );
};

