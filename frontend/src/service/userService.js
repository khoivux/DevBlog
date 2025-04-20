
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
  
      return response.data.data.data; 
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
  
      return response.data.data.data; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const followUser = async (followedId) => {
    try {
      const response = await axiosClient.post(`${API_URL}/follow/${followedId}`);
      
      return response.data.message; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  
  export const unfollowUser = async (followedId) => {
    try {
      const response = await axiosClient.post(`${API_URL}/unfollow/${followedId}`);

      return response.data.message; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const editProfile = async (request) => {
    try {
      const response = await axiosClient.post(`${API_URL}/edit`, request);

      return response.data; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  
  export const getList = async (
    query,
    page = 1,
    size = 5,) => {
    try {
      const response = await axiosClient.get(`${API_URL}/`,{
        params: {
          query,
          page,
          size
        },
      });
      return response.data.data; 
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };