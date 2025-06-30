import axios from "axios";
const API_URL = "http://localhost:8081/api/v1/upload";

export const uploadFile = async (file) => {
    if (!file) {
        console.error("Không có file nào được chọn!");
        return null;
    }

    // Lấy token từ localStorage hoặc context
    const token = localStorage.getItem("access_token"); 
    if (!token) throw new Error("Chưa có token!");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(API_URL, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`, // Thêm token vào header
            },
        });

        console.log("Tải file thành công:", response.data);
        return response.data.data; // Trả về link cloundinary của ảnh sau khi up
    } catch (error) {
        console.error("Lỗi khi tải file:", error.response?.data || error.message);
        return null;
    }
};
