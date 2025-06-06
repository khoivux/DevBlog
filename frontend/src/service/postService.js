import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/post";

export const getPosts = async (    
    page = 1,
    size = 5,
    query = null,
    categoryId = null,
    sortBy = "latest",
    status = "APPROVED"
 ) => {
    try {
      
      const response = await axiosClient.get(`${API_URL}/`, {
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
        const response = await axiosClient.post(`${API_URL}/create`, postData);

        console.log("Đăng bài thành công:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {

            const message  = error.response.data.message;
            throw new Error(message); 
          }
          throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const deletePost = async (postId) => {
    try {
      const response = await axiosClient.delete(`${API_URL}/delete/${postId}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Lỗi kết nối đến server!";
      throw new Error(message);
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
        throw new Error(error.response.data.message);
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  
  export const checkVote = async (postId) => {
    try {
      const response = await axiosClient.get(`${API_URL}/vote/${postId}`, null);
  
      return response.data.data; // Trả về dữ liệu từ API
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi vote bài viết!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const editPost = async (postData) => {
    try {
        const response = await axiosClient.put(`${API_URL}/edit`, postData);

        console.log("Chỉnh sửa bài viết thành công:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
        throw new Error(error.response.data.message || "Lỗi khi vote bài viết!");
      }
      throw new Error("Lỗi kết nối đến server!");
    }
};
