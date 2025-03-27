import { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { User, Heart, Pencil } from "lucide-react";
import { getAuthor, getFollowers, getFollowing, followUser, unfollowUser} from "../service/userService.js";
import { Link } from "react-router-dom";
Modal.setAppElement("#root"); // Đảm bảo modal hoạt động đúng

const Author = ({ username}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const closeModal = () => setModalIsOpen(false);
  const [author, setAuthor] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState(null);
  const [currUser, setCurrUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    // Lấy user từ sessionStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrUser(JSON.parse(storedUser)); // Parse JSON để dùng
    }
  }, []);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const data = await getAuthor(username);
        if (data) {
          setAuthor(data);
        } else {
          setError("Bạn chưa đăng nhập!");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAuthor();
  }, [username]);

  // Xử lý theo dõi hoặc bỏ theo dõi
  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(author.id); // Gọi API hủy theo dõi
      } else {
        await followUser(author.id); // Gọi API theo dõi
      }

      fetchData();
    } catch (error) {
      alert(error.message);
    }
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
      setError(err.message);
    }
  };

  useEffect(() => {
  
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
    <div className="bg-white shadow-lg rounded-[40px] p-4 h-fit border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-center border-b pb-2">Tác giả</h2>

      {/* Avatar & Author Info */}
      <div className="flex items-center gap-4 mb-3">
        <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
          <img src='/avatar.png' alt="" />
        </div>
        <Link to={`/author/${author.username}`} className="text-lg font-bold hover:text-red-500">
          {author.displayName}
          <p href="/author" className="italic font-semibold text-base text-gray-500">@{author.username}</p>
        </Link>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mt-2 px-1">{author.introduction}</p>

      {/* Social Icons */}
      <div className="flex gap-3 mt-2">
        <a href="" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-blue-600 text-2xl cursor-pointer" />
        </a>
        <a href="" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-pink-500 text-2xl cursor-pointer" />
        </a>
      </div>

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
        <div className="flex items-center gap-1">
          <Pencil className="w-4 h-4 text-gray-500" />
          <a href="/author" className="text-sm text-gray-600 hover:underline cursor-pointer">10 bài viết</a>
        </div>
      </div>

      <div>
        {currUser && currUser.username === username ? (
          // Nếu là chính chủ thì hiển thị nút "Thay đổi thông tin"
          <button
          // Hàm mở modal chỉnh sửa
            onClick={() => openModal("Chỉnh sửa thông tin", currUser)}
            className="block mx-auto mt-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:scale-105 transition"
          >
            Thay đổi thông tin
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


      
      


       {/* Reusable Modal */}
       <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel={modalTitle}
        className="bg-white p-6 rounded-xl shadow-lg w-[300px] border border-gray-300 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-center mb-4">{modalTitle}</h2>

        {/* Danh sách followers hoặc following */}
        <div className="max-h-60 overflow-y-auto space-y-3">
          {modalData.length > 0 ? (
            modalData.map((user) => (
              <div key={user.id} className="flex items-center gap-3 border-b pb-2">
                <img src={user.avatarUrl} alt={user.displayName} className="w-10 h-10 rounded-full object-cover" />
                <a href={`/author/${user.username}`} className="text-sm text-gray-700 font-semibold hover:text-red-500">
                  {user.displayName}
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Không có dữ liệu</p>
          )}
        </div>

        {/* Nút đóng */}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setModalIsOpen(false)}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Đóng
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Chỉnh sửa thông tin tác giả"
        className="bg-white p-6 rounded-xl shadow-lg w-[450px] border border-gray-300 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-center mb-4">Chỉnh sửa thông tin</h2>


        <div className="flex items-center gap-4 mb-2">
          {/* Ảnh đại diện */}
          <img
            src="/avatar.png"
            alt="Avatar"
            className="w-20 h-20 rounded-full border border-gray-300 object-cover"
          />

          {/* Nút chọn ảnh */}
          <input
            type="file"
            accept="image/*"
            className="text-sm text-gray-600"
          />
        </div>


        <div className="space-y-2">
          {inputFields.map(({ label, name, type }) => (
            <div key={name}>
              <label className="block font-semibold">{label}</label>
              {type === "textarea" ? (
                <textarea name={name} className={inputClass} />
              ) : (
                <input type={type} name={name} className={inputClass} />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-2">
          <button onClick={closeModal} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
            Hủy
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Lưu thay đổi
          </button>
        </div>
      </Modal>


    </div>
  );
};

export default Author;
