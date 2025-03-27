
import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/category";

export const getCategories = async (page, size, query = "") => {
    try {
        const response = await axiosClient.get(`${API_URL}/list`, {
            params: { page, size, query }, // Truy vấn bằng query params
        });
        return response.data; // Trả về API Response
      } catch (error) {
        if (error.response) {
          // Lấy thông tin từ ErrorResponse
          const message  = error.response.data.message;
          throw new Error(message); 
        }
        throw new Error("Lỗi kết nối đến server!");
      }
  };