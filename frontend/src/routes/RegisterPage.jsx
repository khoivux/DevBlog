import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../service/authService";
const RegisterPage = () => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
  
    const formData = {
      firstname,
      lastname,
      username,
      email,
      phone,
      password,
      confirmPassword,
    };
  
    try {
      const response = await register(formData);
      navigate("/login");
    } catch (err) {
      setError(err.message); // Hiển thị lỗi từ backend
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="items-center bg-white p-8 rounded-2xl shadow-custom w-96">
        {/* Logo + Title */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-2">
            <img src="https://res.cloudinary.com/drdjvonsx/image/upload/v1745129650/logo_vgrbmq.png" alt="Logo" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">DevBlog</h2>
          
        </div>

        {/* Form */}
        <form className="mt-6" onSubmit={handleRegister}>
          {/* Họ & Tên */}
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Họ"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Tên"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="w-1/2 px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Tên đăng nhập */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Email */}
          <div className="mb-4">
            <input
              type="phone"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Mật khẩu */}
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute right-3 top-2.5 cursor-pointer text-gray-500">
              👁
            </span>
          </div>
          {/* Xác nhận mật khẩu */}
          <div className="mb-4 relative">
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span className="absolute right-3 top-2.5 cursor-pointer text-gray-500">
              👁
            </span>
          </div>
          {error && <p className="text-red-500 text-base font-medium text-center mt-2">{error}</p>}
          {/* Nút Đăng ký */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Đăng ký
          </button>
        </form>

        {/* Links */}
     
        <div className="flex justify-between mt-4 text-base font-medium text-blue-500">
          <a href="/login" className="hover:underline">Đăng nhập</a>
          <a href="/forgot-password" className="hover:underline">Quên mật khẩu</a>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
