import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { KeyIcon, EyeIcon, BellIcon, LockClosedIcon } from "@heroicons/react/24/solid";
import ConfirmDeleteModal from "../ConfirmDeleteModal.jsx"
const UserManagement = () => {
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);

  // Mở modal xóa với thông tin phù hợp
  const openLockModal = () => {
    setIsLockModalOpen(true);
  };

  // Đóng modal
  const closeLockModal = () => {
    setIsLockModalOpen(false);
  };

  // Hàm xử lý xóa
  const handleLock = () => {
    console.log(`Đã xóa`);
    closeDeleteModal();
  };

  const users = [
    { id: 1, name: "Nguyễn Văn A", email: "a@example.com", role: "User" },
    { id: 2, name: "Trần Thị B", email: "b@example.com", role: "User" },
    { id: 3, name: "Lê Văn C", email: "c@example.com", role: "User" },
    { id: 4, name: "Lê Văn D", email: "d@example.com", role: "User" },
    { id: 5, name: "Lê Văn E", email: "e@example.com", role: "User" },
  ];

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4">Quản lý người dùng</h2>
      <div className="flex space-x-2 mb-4 ml-10">
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border px-2 py-1 text-sm rounded w-1/2"
        />
        
        <button className="bg-green-500 text-white px-4 py-1 rounded">
          Tìm kiếm
        </button>
      </div>
      <div className="flex justify-center px-4">
        <table className="border-collapse border border-gray-300 text-sm w-full max-w-[95%]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border">Số thứ tự</th>
              <th className="border">Tên</th>
              <th className="border">Email</th>
              <th className="border">Quyền hạn</th>
              <th className="border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className="text-center border">
                <td className="border px-1 py-1">{index + 1}</td>
                <td className="border px-1 py-1 break-words whitespace-normal">{user.name}</td>
                <td className="border px-1 py-1 break-words whitespace-normal">{user.email}</td>
                <td className="border px-1 py-1 break-words whitespace-normal">{user.role}</td>
                <td className="border px-1 py-1 space-x-1">

                  <Tooltip content="Trang cá nhân">
                    <a href="/author"
                        target="_blank"
                        className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </a>
                  </Tooltip>

                  <Tooltip content="Cấp quyền">
                    <a href="/#"
                        className="bg-green-500 text-white p-2 rounded inline-flex items-center"
                    >
                      <KeyIcon className="h-4 w-4" />
                    </a>
                  </Tooltip>

                  <Tooltip content="Thông báo">
                    <a href="/#"
                        className="bg-orange-500 text-white p-2 rounded inline-flex items-center"
                    >
                      <BellIcon className="h-4 w-4" />
                    </a>
                  </Tooltip>

                  <Tooltip content="Khóa tài khoản">
                    <a 
                        onClick={openLockModal}
                        className="bg-red-500 text-white p-2 rounded inline-flex items-center cursor-pointer"
                    >
                      <LockClosedIcon className="h-4 w-4" />
                    </a>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Xác nhận xóa */}
      <ConfirmDeleteModal
        isOpen={isLockModalOpen}
        onClose={closeLockModal}
        onConfirm={handleLock}
        title={`Xác nhận khóa`}
        message={`Bạn có chắc chắn muốn khóa tài khoản người dùng không?`}
        type={'user'}
      />
    </div>
  );
}
export default UserManagement;