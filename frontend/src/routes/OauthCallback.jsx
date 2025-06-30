import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../service/userService";
const OauthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const handleOAuthLogin = async () => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      try {
        const user = await getCurrentUser(); // ✅ await đúng cách
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/");
        window.location.reload(); // hoặc dùng context/state để cập nhật UI thay vì reload
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
        navigate("/login?error=user_not_found");
      }
    } else {
      console.error("Token not found in URL");
      navigate("/login?error=oauth_failed");
    }
  };

  handleOAuthLogin(); // Gọi hàm async trong useEffect
}, [navigate]);

  return (
    <div className="text-center mt-20 text-xl font-semibold text-gray-700">
      Đang xử lý đăng nhập...
    </div>
  );
};

export default OauthCallback;