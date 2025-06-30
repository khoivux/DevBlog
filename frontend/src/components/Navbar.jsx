import { useState, useEffect, useRef } from "react";
import { useToast } from "../contexts/ToastContext";
import { useLocation,useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { logout } from "../service/authService";
import { changePassword } from "../service/userService";
import NotificationDropdown from "./NotificationDropdown";
import ChangePassword from "./modal/ChangePassword";
import "moment/locale/vi";

const Navbar = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
    const menuRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); 
    }
  }, []);

  const handleLogout = async () => {
    try {  
      await logout()
      localStorage.removeItem("access_token");
      localStorage.removeItem("user") // Xóa token khỏi localStorage
      navigate("/login") // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.log("Lỗi khi đăng xuất:");
    }
  };

  const handleChangePassword = async ({ oldPassword, newPassword, confirmNewPassword }) => {
    try {
      const response = await changePassword(oldPassword, newPassword, confirmNewPassword);
      showToast("success", response.message);
      setShowChangePassword(false);
    } catch (error) {
      showToast("error", error.message);
    }
  };
  
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
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
        <div className="z-50 relative  flex items-center" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <img
                  src={(user && user.avatarUrl)|| "https://res.cloudinary.com/drdjvonsx/image/upload/v1741858825/ad2h5wifjk0xdqmawf9x.png"} // Dùng avatar từ Cloudinary, fallback nếu null
                  alt="User Avatar"
                  className="w-16 h-16 rounded-full border-4"
                  style={{ borderColor: "#D1D5DB" }}
                />
                {dropdownOpen && (
                <div  ref={menuRef}  className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">
                  <Link
                    to={`/author/${user.username}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Đổi mật khẩu
                  </button>
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

            {user && (
              <>
                <a
                  href="/write"
                  className="py-2 px-4 rounded-3xl bg-[#c1c1f7] text-gray-700 hover:scale-105"
                >
                  Tạo bài viết mới
                </a>
                <NotificationDropdown />
              </>
            )}


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
                <div  ref={menuRef}  className="absolute top-full right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden">
                  <Link
                    to={`/author/${user.username}`}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Trang cá nhân
                  </Link>
                  <button
                    onClick={() => setShowChangePassword(true)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                  >
                    Đổi mật khẩu
                  </button>
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
      <ChangePassword
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSubmit={handleChangePassword}
      />

   </div>
  );
};

export default Navbar;