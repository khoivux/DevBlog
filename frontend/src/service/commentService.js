import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/comment";

export const getComments = async (    
    page = 1,
    size = 1000,
    postId,
    parentId = null
 ) => {
    try {
      
      const response = await axiosClient.get(`${API_URL}/${postId}`, {
        params: {
          page,
          size,
          parentId,
        },
      });
  
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

  export const getChildComments = async (    
    page = 1,
    size = 1000,
    parentId
 ) => {
    try {
      
      const response = await axiosClient.get(`${API_URL}/children/${parentId}`, {
        params: {
          page,
          size,
        },
      });
  
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



  export const createComment = async (commentDTO) => {
    try {
        const response = await axiosClient.post(`${API_URL}/`, commentDTO);

        console.log(response.data);
        return response.data.data;
    } catch (error) {
      if (error.response) {
        // Lấy thông tin từ ErrorResponse
        const message  = error.response.data.message;
        throw new Error(message); 
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const editComment = async (commentDTO) => {
    try {
        const response = await axiosClient.patch(`${API_URL}/`, commentDTO);

        console.log(response.data);
        return response.data.data;
    } catch (error) {
      if (error.response) {
        // Lấy thông tin từ ErrorResponse
        const message  = error.response.data.message;
        throw new Error(message); 
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  
  export const deleteComment = async (commentId) => {
    try {
        const response = await axiosClient.delete(`${API_URL}/`, {
        params: {
          commentId,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        // Lấy thông tin từ ErrorResponse
        const message  = error.response.data.message;
        throw new Error(message); 
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  };
  