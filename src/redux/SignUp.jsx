import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.jsx";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User } from "lucide-react";


export const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", formData);
      const { token, user } = response.data;

      if (token && user) {
        setToken(token);
        setUser(user);

        Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: `Account created successfully, ${user.name}!`,
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong";
      Swal.fire({
        icon: "error",
        title: "Signup Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-12 text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block mb-4"
            >
              <div className="p-3 bg-white rounded-full">
                <UserPlus size={32} className="text-purple-600" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
            <p className="text-purple-100 font-semibold">Join our community today</p>
          </div>

          {/* Form Content */}
          <div className="px-8 py-10">
            <form onSubmit={handleSignUp} className="space-y-6">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <User size={18} className="text-purple-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none transition-all bg-slate-50 font-medium placeholder-slate-400"
                />
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Mail size={18} className="text-purple-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none transition-all bg-slate-50 font-medium placeholder-slate-400"
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label className="block text-sm font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Lock size={18} className="text-purple-600" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-purple-600 focus:outline-none transition-all bg-slate-50 font-medium placeholder-slate-400"
                />
              </motion.div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
              >
                {loading ? (
                  <>
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      ⏳
                    </motion.span>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Sign Up
                  </>
                )}
              </motion.button>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-slate-600 font-medium text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-purple-600 hover:text-purple-700 font-black transition-colors underline underline-offset-2"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>

            {/* Terms */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center text-xs text-slate-500 mt-8 pt-8 border-t border-slate-200"
            >
              By signing up, you agree to our Terms of Service and Privacy Policy
            </motion.p>
          </div>
        </div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-600 font-semibold mt-8 text-sm"
        >
          Secure registration with encrypted connection 🔒
        </motion.p>
      </motion.div>
    </div>
  );
};

