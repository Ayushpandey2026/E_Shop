// src/api/axios.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/web", // ✅ backend base
  withCredentials: true,
});

// Request interceptor -> har request ke sath token bhejo
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ localStorage se lo
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
