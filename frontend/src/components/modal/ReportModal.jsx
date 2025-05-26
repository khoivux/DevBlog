import Modal from "react-modal";
import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
const postReasons = [
  "Nội dung không chính xác",
  "Chứa thông tin sai lệch, gây hiểu lầm",
  "Nội dung vi phạm bản quyền",
  "Bài viết chứa ngôn từ không phù hợp",
  "Khác",
];

const commentReasons = [
  "Bình luận mang tính công kích cá nhân",
  "Ngôn từ thô tục, phản cảm",
  "Spam hoặc quảng cáo không phù hợp",
  "Nội dung không liên quan đến bài viết",
  "Khác",
];

function ReportModal({ isOpen, onClose, onSubmit, type = "post" }) {
  const {showToast} = useToast();
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasons = type === "comment" ? commentReasons : postReasons;
  const title = type === "comment" ? "Báo cáo bình luận" : "Báo cáo bài viết";

  const handleSubmit = () => {
    const reasonToSend =
      selectedReason === "Khác" ? customReason.trim() : selectedReason;

    if (!reasonToSend) {
      showToast('warning', "Vui lòng chọn vi phạm");
      return;
    }
    onSubmit(reasonToSend);
    setSelectedReason("");
    setCustomReason("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title}
      className="bg-white p-6 rounded-xl shadow-lg w-[400px] border border-gray-300 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold text-center mb-4 text-black">
        {title}
      </h2>

      <div className="flex flex-col gap-3">
        {reasons.map((reason) => (
          <label key={reason} className="flex items-center gap-2 text-gray-700">
            <input
              type="radio"
              name="reportReason"
              value={reason}
              checked={selectedReason === reason}
              onChange={() => setSelectedReason(reason)}
            />
            {reason}
          </label>
        ))}

        {selectedReason === "Khác" && (
          <textarea
            className="border border-gray-300 rounded-md p-2 w-full mt-2"
            placeholder="Nhập lý do khác..."
            rows={3}
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Gửi báo cáo
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Hủy
        </button>
      </div>
    </Modal>
  );
}

export default ReportModal;
