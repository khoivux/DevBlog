
import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/admin";

export const blockUser = async ({ username, isBlocked }) => {
    try {
      const response = await axiosClient.patch(`${API_URL}/block`, null, {
        params: {
          username,
          block: !isBlocked,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi kết nối đến server!";
      throw new Error(message);
    }
  };
  
  export const setRole = async ({ username, role }) => {
    try {
      const response = await axiosClient.patch(`${API_URL}/set-roles`, null, {
        params: {
          username,
          role,
        },
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi kết nối đến server!";
      throw new Error(message);
    }
  }; 
  
  export const updateStatus = async (postId, status, message = null) => {
  try {
    const response = await axiosClient.patch(`${API_URL}/status/${postId}`, null, {
      params: {
        status: status.toUpperCase(),
        message,
      },
    });
    return response.data;
  } catch (error) {
    const errMessage = error.response?.data?.message || "Lỗi kết nối đến server!";
    throw new Error(errMessage);
  }
};
