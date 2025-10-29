// src/utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://e-shop-backend-iqb1.onrender.com/api/web",
});

// Request interceptor for attaching token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
