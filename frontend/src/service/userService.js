
import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/users";

export const getUser = async (username) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${username}`);
  
      const user = response.data.data;
      return user;
    } catch (error) {
      throw new Error("Lỗi khi lấy thông tin user!");
    }
  };

  export const getAuthor = async (username) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${username}`);

      return response.data.data;
    } catch (error) {
      throw new Error("Lỗi khi lấy thông tin user!");
    }
  };
  

  export const getFollowers = async (
    username,
    page = 1,
    size = 1000,
  ) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${username}/followers`,{
        params: {
          page,
          size
        },
      });
  
      return response.data.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi vote bài viết!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const getFollowing = async (
    username,
    page = 1,
    size = 1000,
  ) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${username}/following`,{
        params: {
          page,
          size
        },
      });
  
      return response.data.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi vote bài viết!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const followUser = async (followedId) => {
    try {
      const response = await axiosClient.post(`${API_URL}/follow/${followedId}`);
      
      // Trả về thông báo từ API (theo cấu trúc ApiResponse)
      return response.data.message; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi follow người dùng!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  
  export const unfollowUser = async (followedId) => {
    try {
      const response = await axiosClient.post(`${API_URL}/unfollow/${followedId}`);
      
      // Trả về thông báo từ API (theo cấu trúc ApiResponse)
      return response.data.message; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi hủy theo dõi người dùng!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  