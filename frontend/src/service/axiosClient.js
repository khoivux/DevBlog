// axiosClient.js - Cấu hình axios với interceptor
import axios from "axios";

// Khởi tạo instance axios
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1", // API Backend
  withCredentials: true,                // Cho phép gửi cookie (refresh token)
});

// Lấy Access Token từ localStorage
const getAccessToken = () => localStorage.getItem("access_token");

// Interceptor: Tự động thêm token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đánh dấu tránh lặp vô hạn

      try {
        const refreshToken = localStorage.getItem("refresh_token"); 
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        const { data } = await axios.post(
          "http://localhost:8080/api/auth/refresh",
          { token: refreshToken }, 
          { withCredentials: true }
        );
        const newAccessToken = data.data.accessToken;
        // Lưu access token mới
        localStorage.setItem("access_token", newAccessToken);

        // Gán token mới vào headers và gửi lại request cũ
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
