// axiosClient.js - Cấu hình axios với interceptor
import axios from "axios";

// Khởi tạo instance axios
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/v1", // API Backend
  withCredentials: true,                // Cho phép gửi cookie (refresh token)
});

// Lấy Access Token từ localStorage
const getAccessToken = () => localStorage.getItem("JWToken");

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

// Interceptor: Tự động refresh token khi access token hết hạn
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response && error.response.status === 401) {
//       try {
//         // Gọi API refresh token
//         const { data } = await axios.post("http://localhost:8080/api/auth/refresh", {}, { withCredentials: true });

//         // Lưu Access Token mới
//         localStorage.setItem("accessToken", data.token);

//         // Thử lại request ban đầu với token mới
//         error.config.headers.Authorization = `Bearer ${data.token}`;
//         return axiosClient(error.config);
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
