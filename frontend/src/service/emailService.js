import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/notification"

export const sendOTP = async (email) => { 
    try {
        const response = await axiosClient.post(`${API_URL}/send-otp`, {
            params: {
                email
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