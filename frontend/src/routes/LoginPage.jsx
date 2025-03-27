import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../service/authService";
import { getUser } from "../service/userService";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { token, authenticated } = await login(username, password);
      if (authenticated) {
        const user = await getUser(username);
        localStorage.setItem("user", JSON.stringify(user)); // Hiển thị thông tin người dùng đăng nhập
        navigate("/");
      }
    } catch (err) {
      setError(err.message); // Hiển thị lỗi từ backend
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-2xl shadow-custom w-96">
        <h2 className="text-xl font-semibold text-gray-700 text-center">DevBlog</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <form className="mt-6" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Tên đăng nhập hoặc email..."
            className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu..."
            className="w-full px-4 py-2 border rounded-lg bg-gray-100 mt-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
