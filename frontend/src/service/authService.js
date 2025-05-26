import axios from "axios";

const API_URL = "http://localhost:8081/api/v1/auth";

// Đăng nhập
export const login = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { input:username, password });
      const token = response.data.data.token;
      if(token) {
        localStorage.setItem("JWToken", token);
      }
      return response.data.data; // Trả về { token, authenticated }
    } catch (error) {
      if (error.response) {
        // Lấy thông tin từ ErrorResponse
        const message  = error.response.data.message;
        throw new Error(message); 
      }
      throw new Error("Lỗi kết nối đến server!");
    }
  }

// Đăng ký
export const register = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, formData);
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      throw new Error(message);
    }
    throw new Error("Lỗi kết nối đến server!");
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem("JWToken");
    if (!token) throw new Error("Chưa có token!");

    const response = await axios.post(
      `${API_URL}/logout`,
      { token }, // Gửi token trong body
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      throw new Error(message);
    }
    throw new Error("Lỗi kết nối đến server!");
  }
};

export const verifyEmail = async (email, otp) => {
  try {
    const response = await axios.post(`${API_URL}/verify-email`, null, {
      params: {
        email,
        otp,
      },
    });
    return response.data; // Trả về boolean
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      throw new Error(message); 
    }
    throw new Error("Lỗi kết nối đến server!");
  }
}


export const resetPassword = async (
  email,
  password,
  confirmPassword) => {
  try {
    const response = await axios.put(`${API_URL}/reset-password`, null, {
      params: {
        email,
        password,
        confirmPassword
      },
    });
    return response.data; 
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    }
    throw new Error("Lỗi kết nối đến server!");
  }
};

