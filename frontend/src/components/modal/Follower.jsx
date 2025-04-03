import Modal from "react-modal";

Modal.setAppElement("#root"); // Đảm bảo modal hoạt động đúng

const Follower = ({ isOpen, onClose, title, data }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="bg-white p-6 rounded-xl shadow-lg w-[300px] border border-gray-300 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold text-center mb-4">{title}</h2>

      {/* Danh sách followers hoặc following */}
      <div className="max-h-60 overflow-y-auto space-y-3">
        {data.length > 0 ? (
          data.map((user) => (
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
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default Follower;
