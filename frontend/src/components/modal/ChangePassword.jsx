import { useState } from "react";
import { useToast } from "../../contexts/ToastContext";
export default function ChangePassword({ isOpen, onClose, onSubmit }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const { showToast } = useToast();

  const handleSubmit = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      showToast("error", "Vui lòng điền đầy đủ thông tin")
      return;
    }

    onSubmit({ oldPassword, newPassword, confirmNewPassword});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>


        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mật khẩu cũ</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu mới</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

