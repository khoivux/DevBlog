import axiosClient from "./axiosClient";
const API_URL = "http://localhost:8081/api/v1/notification"



export const getNotifications = async (    
    page = 1,
    size = 5,
 ) => {
    const storedUser  = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;  
    if(user == null) throw new Error("Bạn chưa đăng nhập")  
    try {
        const response = await axiosClient.get(`${API_URL}/${user.id}`, {
            params: {
                page,
                size,
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

export const markAsRead = async () => {
    const storedUser  = localStorage.getItem("user");
const user = storedUser ? JSON.parse(storedUser) : null;  
if(user == null) throw new Error("Bạn chưa đăng nhập")  
    try {
        const response = await axiosClient.post(`${API_URL}/mark-as-read/${user.id}`);

        return response.data; 
    } catch (error) {
        if (error.response) {
            const message  = error.response.data.message;
            throw new Error(message); 
          }
          throw new Error("Lỗi kết nối đến server!");
    }
};