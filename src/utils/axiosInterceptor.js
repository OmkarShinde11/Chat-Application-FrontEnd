// src/utils/axiosInstance.js
import axios from "axios";
import API_URL from '../utils/api_url'

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("token"));

    // 👉 Add token to all except GET requests
    // if (token && config.method.toLowerCase() !== "get") {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
