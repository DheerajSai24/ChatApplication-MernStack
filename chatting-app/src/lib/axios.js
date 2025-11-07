import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "https://chatting-app-backend-1xxn.onrender.com/api",
  withCredentials: true,
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("🌐 API Request:", config.method.toUpperCase(), config.url);
    console.log("📦 Request data:", config.data);
    console.log("🔗 Full URL:", config.baseURL + config.url);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ API Response:", response.status, response.config.url);
    console.log("📥 Response data:", response.data);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error.message);
    if (error.response) {
      console.error("❌ Error status:", error.response.status);
      console.error("❌ Error data:", error.response.data);
    } else if (error.request) {
      console.error("❌ No response received:", error.request);
    }
    return Promise.reject(error);
  }
);