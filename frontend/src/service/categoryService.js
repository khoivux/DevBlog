
import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/category";

export const getCategories = async (page, size, query = null) => {
    try {
        const response = await axiosClient.get(`${API_URL}/`, {
            params: { page, size, query }, // Truy vấn bằng query params
        });
        return response.data; 
      } catch (error) {
        if (error.response) {
          const message  = error.response.data.message;
          throw new Error(message); 
        }
        throw new Error("Lỗi kết nối đến server!");
      }
  };


  export const createCategory = async (categoryName) => {
    try {
      const response = await axiosClient.post(`${API_URL}/create`, null, {
        params: {
          categoryName,
        },
      });
      
        return response.data; 
      } catch (error) {
        if (error.response) {
          const message  = error.response.data.message;
          throw new Error(message); 
        }
        throw new Error("Lỗi kết nối đến server!");
      }
  };

  
  export const deleteCat = async (categoryId) => {
    try {
      const response = await axiosClient.delete(`${API_URL}/delete`, {
        params: { categoryId },
      });
      
        return response.data; 
      } catch (error) {
        if (error.response) {
          const message  = error.response.data.message;
          throw new Error(message); 
        }
        throw new Error("Lỗi kết nối đến server!");
      }
  };

  export const updateCategory = async (category) => {
    try {
      const response = await axiosClient.put(`${API_URL}/edit`, category);
      
        return response.data; 
      } catch (error) {
        if (error.response) {
          const message  = error.response.data.message;
          throw new Error(message); 
        }
        throw new Error("Lỗi kết nối đến server!");
      }
  };

