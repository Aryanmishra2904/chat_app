// lib/axios.js
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,   // 🔑 ensures cookies (jwt) are sent
});
