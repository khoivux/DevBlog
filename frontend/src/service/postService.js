import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/post";

export const getPosts = async (    
    page = 1,
    size = 5,
    query = "",
    categoryId = null,
    sortBy = "id",
    status = "APPROVED"
 ) => {
    try {
      
      const response = await axiosClient.get(`${API_URL}/list`, {
        params: {
          page,
          size,
          query,
          categoryId,
          sortBy,
          status: status.toUpperCase(), // Đảm bảo status viết thường
        },
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

  export const getSinglePost = async (postId) => {
    try {
      const response = await axiosClient.get(`${API_URL}/${postId}`);
  
      return response.data.data; // Trả về API Response
    } catch (error) {
        if (error.response) {
            // Lấy thông tin từ ErrorResponse
            const message  = error.response.data.message;
            throw new Error(message); 
          }
          throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const createPost = async (postData) => {
    try {
        const response = await axiosClient.post(`${API_URL}/add`, postData);

        console.log("Đăng bài thành công:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi đăng bài:", error.response?.data || error.message);
        return null;
    }
};

  export const getPostsByAuthorId = async (
    sortBy, 
    authorId,
    page = 1,
    size = 5
  ) => {
    try {
      const response = await axiosClient.get(`${API_URL}/user/${authorId}`, {
        params: {
          sortBy,
          page,
          size
        },
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

  export const votePost = async (postId, voteType) => {
    try {
      const response = await axiosClient.post(`${API_URL}/${postId}/${voteType}`, null);
  
      return response.data; // Trả về dữ liệu từ API
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi vote bài viết!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  