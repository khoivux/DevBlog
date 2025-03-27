import Modal from "react-modal";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, title, message, type }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Xác nhận xóa"
      className="bg-white p-6 rounded-xl shadow-lg w-[350px] border border-gray-300 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold text-center mb-4 text-red-600">{title}</h2>
      <p className="text-center text-gray-600 mb-4">{message}</p>

      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Xác nhận
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
