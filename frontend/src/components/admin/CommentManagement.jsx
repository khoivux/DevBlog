import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";
import { EyeIcon, TrashIcon, ExclamationTriangleIcon, CheckIcon} from "@heroicons/react/24/solid";
import ConfirmDeleteModal from "../ConfirmDeleteModal.jsx"
const CommentManagement = ({ status }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Mở modal xóa với thông tin phù hợp
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // Đóng modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteItem(null);
  };

  // Hàm xử lý xóa
  const handleDelete = () => {
    console.log(`Đã xóa`);
    closeDeleteModal();
  };
  const reportedComments = [
    {
      id: 1,
      content: "Bài viết này không đúng sự thật! Bài viết này không đúng sự thật! Bài viết này không đúng sự thật!",
      author: "Nguyễn Văn A",
      description: "Bình luận có nội dung sai lệch",
      reporter: "Trần Thị B",
    },
    {
      id: 2,
      content: "Ngôn từ không phù hợp!",
      author: "Lê Văn C",
      description: "Vi phạm nội quy diễn đàn",
      reporter: "Phạm Thị D",
    },
    {
      id: 3,
      content: 
      "Bài viết này không đúng sự thật! Bài viết này không đúng sự thật! Bài viết này không đúng sự thật!",
      author: "Nguyễn Văn A",
      description: "Bình luận có nội dung sai lệch",
      reporter: "Trần Thị B",
    },
    {
      id: 4,
      content: "Ngôn từ không phù hợp!",
      author: "Lê Văn C",
      description: "Vi phạm nội quy diễn đàn",
      reporter: "Phạm Thị D",
    },
    {
      id: 5,
      content: "Bài viết này không đúng sự thật! Bài viết này không đúng sự thật! Bài viết này không đúng sự thật!",
      author: "Nguyễn Văn A",
      description: "Bình luận có nội dung sai lệch",
      reporter: "Trần Thị B",
    },
  ];
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4">Báo cáo bình luận</h2>
      <div className="flex justify-center px-4">
        <table className="border-collapse border border-gray-300 text-sm w-full max-w-[95%]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Mã bình luận</th>
              <th className="border p-2">Nội dung bình luận</th>
              <th className="border p-2">Tác giả</th>
              <th className="border p-2">Mô tả vi phạm</th>
              <th className="border p-2">Người báo cáo</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reportedComments.map((comment) => (
              <tr key={comment.id} className="text-center border">
                <td className="border p-2">{comment.id}</td>
                <td className="border p-2 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{comment.content}</td>
                <td className="border p-2">{comment.author}</td>
                <td className="border p-2">{comment.description}</td>
                <td className="border p-2">{comment.reporter}</td>
                <td className="border p-2 max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap flex justify-center space-x-2">
                  <Tooltip content="Xem bài">
                    <button className="bg-blue-500 text-white p-2 rounded">
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Bỏ qua">
                    <button className="bg-green-500 text-white p-2 rounded">
                      <CheckIcon className="h-4 w-4" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Thông báo">
                    <button className="bg-orange-500 text-white p-2 rounded">
                      <ExclamationTriangleIcon className="h-4 w-4" />
                    </button>
                  </Tooltip>

                  <Tooltip content="Xóa bài">
                    <button
                      className="bg-red-500 text-white p-2 rounded"
                      onClick={() => openDeleteModal(comment.id)} // Mở modal khi nhấn nút xóa
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </Tooltip>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Xác nhận xóa */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title={`Xác nhận xóa`}
        message={`Bạn có chắc chắn muốn xóa bình luận không?`}
        type={'comment'}
      />
    </div>
  );
};

export default CommentManagement;
