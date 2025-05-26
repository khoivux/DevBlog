import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/report";

export const createReportPost = async (reportData) => {
    try {
        const response = await axiosClient.post(`${API_URL}/post/create`, reportData);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message  = error.response.data.message;
            throw new Error(message); 
          }
          throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const createReportComment = async (reportData) => {
    try {
        const response = await axiosClient.post(`${API_URL}/comment/create`, reportData);
        return response.data;
    } catch (error) {
        if (error.response) {
            const message  = error.response.data.message;
            throw new Error(message); 
          }
          throw new Error("Lỗi kết nối đến server!");
    }
  };

  export const getReportPost = async (    
    page = 1,
    size = 5,
    query = null,
    categoryId = null,
    sortBy = "id",
 ) => {
    try {
        const response = await axiosClient.get(`${API_URL}/post/list`, {
          params: {
            page,
            size,
            query,
            categoryId,
            sortBy,
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

  

  export const handleReportPost = async (reportId, status) => {
  try {
    const response = await axiosClient.patch(
      `${API_URL}/post/${reportId}?status=${status}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      throw new Error(message);
    }
    throw new Error("Lỗi kết nối đến server!");
  }
};

export const getReportComment = async (    
    page = 1,
    size = 5,
    sortBy = "latest",
 ) => {
    try {
        const response = await axiosClient.get(`${API_URL}/comment/list`, {
          params: {
            page,
            size,
            sortBy,
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

  export const handleReportComment = async (reportId, status) => {
  try {
    const response = await axiosClient.patch(
      `${API_URL}/comment/${reportId}?status=${status}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      throw new Error(message);
    }
    throw new Error("Lỗi kết nối đến server!");
  }
};