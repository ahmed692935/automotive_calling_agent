// api/axiosInstance.ts
import axios from "axios";
import { logout } from "../store/slices/authSlice";
import { store } from "../store/store";

const API_URL = import.meta.env.VITE_API_URL as string;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      store.dispatch(logout());
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
