import { useState, useEffect } from "react";
import Follower from "./modal/Follower.jsx";
import EditProfile from "./modal/EditProfile.jsx";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { useToast } from "../contexts/ToastContext.jsx";
import { User, Heart, Pencil } from "lucide-react";
import { getAuthor, getFollowers, getFollowing, followUser, unfollowUser} from "../service/userService.js";
import { Link } from "react-router-dom";
// Đảm bảo modal hoạt động đúng

const Author = ({ username}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);
  const [author, setAuthor] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const {showToast} = useToast();

  const fetchAuthor = async () => {
    try {
      const data = await getAuthor(username);
      if (data) {
        setAuthor(data);
      } else {
        setError("Bạn chưa đăng nhập!");
      }
    } catch (err) {
      showToast('error', err.message)
    }
  };

  // Xử lý theo dõi hoặc bỏ theo dõi
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(author.id); // Gọi API hủy theo dõi
      } else {
        await followUser(author.id); // Gọi API theo dõi
      }

      fetchData();
    } catch (err) {
      showToast('warning', err.message)
    }
  };

  const handleSaveProfile = (updatedUser) => {
    setAuthor(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser)); // Cập nhật vào localStorage
    // Phát sự kiện để navbar cũng cập nhật ngay lập tức
    window.dispatchEvent(new Event("storage"));
  };

  const fetchData = async () => {
    try {
      const [followersData, followingData] = await Promise.all([
        getFollowers(username),
        getFollowing(username),
      ]);

      setFollowers(followersData);
      setFollowing(followingData);
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        const isUserFollowing = followersData.some(
          (user) => user.username === storedUser.username
        );
        setIsFollowing(isUserFollowing);
      }
    } catch (err) {
      showToast('error', err.message)
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrUser(JSON.parse(storedUser)); // Parse JSON để dùng
    }
    fetchAuthor();
    fetchData();
  }, [username]);
  
  const [modalTitle, setModalTitle] = useState("");
  const [modalData, setModalData] = useState([]);
  const openModal = (title, data) => {
    setModalTitle(title);
    setModalData(data);
    setModalIsOpen(true);
  };

  const handleSave = () => {
    setAuthor(editData);
    closeModal();
  };


  if (!author) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 h-fit border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">Tác giả</h2>

      {/* Avatar & Author Info */}
      <div className="flex items-center gap-4 mb-3">
    
          <img
            src={author.avatarUrl} 
            className="w-16 h-16 border-4 rounded-full flex items-center justify-center" 
            style={{ borderColor: "#D1D5DB" }}
          />
     
        <Link to={`/author/${author.username}`} className="text-lg font-bold hover:text-red-500">
          {author.displayName}
          <p href="/author" className="italic font-semibold text-base text-gray-500">@{author.username}</p>
        </Link>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-2 px-1">{author.introduction}</p>

      {/* Social Icons */}
      {/* <div className="flex gap-3 mt-2">
        <a href="" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-blue-600 text-2xl cursor-pointer" />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-500 text-2xl cursor-pointer" />
        </a>
      </div> */}

      {/* Thông tin thống kê */}
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4 text-gray-500" />
          <a className="text-sm text-gray-600 hover:underline cursor-pointer"
          onClick={() => openModal("Người theo dõi", followers)}>{followers.length} người theo dõi</a>
        </div>
        <div className="flex items-center gap-1">
          <Heart className="w-4 h-4 text-gray-500" />
          <a className="text-sm text-gray-600 hover:underline cursor-pointer"
          onClick={() => openModal("Đang theo dõi", following)}>{following.length} đang theo dõi</a>
        </div>

      </div>

      <div>
        {currUser && currUser.username === username ? (
          // Nếu là chính chủ thì hiển thị nút "Thay đổi thông tin"
          <button
          // Hàm mở modal chỉnh sửa
            onClick={() => setEditModalOpen(true)}
            className="block mx-auto mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:scale-105 transition"
          >
            Chỉnh sửa hồ sơ
          </button>
        ) : (
          // Nếu không phải chính chủ thì hiển thị nút "+Theo dõi"
          <button
            onClick={handleFollow}
            className={`block mx-auto mt-2 ${
              isFollowing ? "bg-red-500" : "bg-[#18DA22]"
            } text-white font-semibold py-2 px-4 rounded-full hover:scale-105 transition`}
          >
            {isFollowing ? "Bỏ theo dõi" : "+Theo dõi"}
          </button>
        )}
      </div>
      
       {/* Component Follower */}
      <Follower 
        isOpen={modalIsOpen} 
        onClose={() => setModalIsOpen(false)} 
        title={modalTitle} 
        data={modalData} 
      />
      <EditProfile
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={author}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Author;
