import { useState, useEffect } from "react";
import { Tooltip } from "@material-tailwind/react";
import { useLocation,useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "../service/authService";
import NotificationDropdown from "./NotificationDropdown";
import "moment/locale/vi";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleLogout = async () => {
    try {  
      await logout()
      localStorage.removeItem("JWToken");
      localStorage.removeItem("user") // Xóa token khỏi localStorage
      navigate("/login") // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.log("Lỗi khi đăng xuất:");
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem("user"));
      setUser(updatedUser);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  // Kiểm tra nếu đang ở trang admin
  const isAdminPage = location.pathname.startsWith("/admin");
  return (
    <div className="w-full h-16 md:h-20 flex items-center justify-between">
      {/* LOGO */}
      <Link to="/" className="flex items-center gap-4 text-2xl  font-bold">
        <img src="/logo.png" className="cursor-pointer w-8 h-8" alt="Logo" />
        <span>DevBlog</span>
      </Link>
      {/* Nếu là trang admin, chỉ hiển thị avatar admin */}
      {isAdminPage ? (
        <div className="flex items-center gap-4">
          <span className="font-medium text-gray-700">Admin</span>
          <img
            src="/avatar.png"
            alt="Admin Avatar"
            className="w-10 h-10 rounded-full border"
          />
        </div>
      ) : (
        <>
          {/* MOBILE MENU */}
          <div className="md:hidden">
            <div className="cursor-pointer text-4xl" onClick={() => setOpen((prev) => !prev)}>
              {open ? "X" : "☰"}
            </div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-5 font-medium">
            <a href="/" >Trang chủ</a>
            {user?.roles?.includes("MOD") && (
              <a href="/admin">Quản trị</a>
            )}

            <a href="/write" className="py-2 px-4 rounded-3xl bg-[#c1c1f7] text-gray-700 hover:scale-105">
              Tạo bài viết mới
            </a>

            <NotificationDropdown/>

            {/* Hiển thị avatar nếu user đã đăng nhập */}
            {user ? (
              <div className="z-50 relative  flex items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={user.avatarUrl || "https://res.cloudinary.com/drdjvonsx/image/upload/v1741858825/ad2h5wifjk0xdqmawf9x.png"} // Dùng avatar từ Cloudinary, fallback nếu null
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-4"
                  style={{ borderColor: "#D1D5DB" }}
                />
                {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">
                  <Link
                    to={`/author/${user.username}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={() => handleLogout()}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
              </div>
            ) : (
              <a href="/login">
                <button className="py-2 px-4 rounded-3xl bg-blue-800 text-white hover:scale-105">
                  Đăng nhập
                </button>
              </a>
            )}
          </div>
        </>
      )}
   </div>
  );
};

export default Navbar;