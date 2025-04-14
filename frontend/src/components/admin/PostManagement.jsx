import { Tooltip } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import ConfirmDeleteModal from "../modal/ConfirmModal";
import { EyeIcon, TrashIcon, ExclamationTriangleIcon, CheckIcon, PencilIcon } from "@heroicons/react/24/solid";

const PostManagement = ({ status }) => {
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
  const allPosts = [
    {
      id: 1,
      title: "4 tính chất lập trình hướng đối tượng",
      author: "ABC",
      approved: true,
      cat: "OOP",
      date: "2025-02-28 10:30",
      reported: false,
    },
    {
      id: 2,
      title: "Tìm hiểu về Segment Tree",
      author: "ABC",
      approved: true,
      date: "2025-02-28 12:00",
      reported: false,
      cat: "DSA",
    },
    {
      id: 3,
      title: "Git và GitHub cho người mới",
      author: "ABC",
      approved: true,
      reported: true,
      date: "2025-02-28 10:30",
      description: "Spam nội dung không liên quan",
      reporter: "Nguyễn Văn A",
      cat: "Tools",
    },
    {
      id: 4,
      title: "Cấu trúc dữ liệu cây",
      author: "XYZ",
      approved: true,
      reported: true,
      date: "2025-02-28 10:30",
      description: "Ngôn ngữ không phù hợp",
      reporter: "Trần Thị B",
      cat: "DSA",
    },
    {
      id: 5,
      title: "4 tính chất lập trình hướng đối tượng",
      author: "ABC",
      approved: true,
      date: "2025-02-28 10:30",
      reported: false,
      cat: "OOP",
    },
    {
      id: 6,
      title: "Tìm hiểu về Segment Tree",
      author: "ABC",
      approved: false,
      date: "2025-02-28 12:00",
      reported: false,
      cat: "DSA",
    },
    {
      id: 7,
      title: "Git và GitHub cho người mới",
      author: "ABC",
      approved: false,
      reported: true,
      date: "2025-02-28 10:30",
      description: "Spam nội dung không liên quan",
      reporter: "Nguyễn Văn A",
      cat: "Tools",
    },
    {
      id: 8,
      title: "Cấu trúc dữ liệu cây",
      author: "XYZ",
      approved: false,
      reported: true,
      date: "2025-02-28 10:30",
      description: "Ngôn ngữ không phù hợp",
      reporter: "Trần Thị B",
      cat: "DSA",
    },
    {
      id: 9,
      title: "4 tính chất lập trình hướng đối tượng",
      author: "ABC",
      approved: false,
      date: "2025-02-28 10:30",
      reported: false,
      cat: "OOP",
    },
    {
      id: 10,
      title: "Tìm hiểu về Segment Tree",
      author: "ABC",
      approved: false,
      date: "2025-02-28 12:00",
      reported: false,
      cat: "DSA",
    },
  ];

  let posts;
  if (status === "approved") {
    posts = allPosts.filter((post) => post.approved);
  } else if (status === "unapproved") {
    posts = allPosts.filter((post) => !post.approved);
  } else if (status === "report") {
    posts = allPosts.filter((post) => post.reported);
  }

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4">
        {status === "approved"
          ? "Bài viết đã duyệt"
          : status === "unapproved"
          ? "Bài viết chưa duyệt"
          : "Báo cáo vi phạm"}
      </h2>
      <div className="flex space-x-2 mb-4 ml-10">
        <div className="">
                  <label htmlFor="" className="text-base font-medium pr-3">Danh mục</label>
                  <select name="category" id="" className="p-2 rounded-lg bg-white">
                      <option value="">AI</option>
                      <option value="">Android</option>
                      <option value="">Java</option>
                      <option value="">DSA</option>
                      <option value="">OOP</option>
                      <option value="">Game</option>
                  </select>
              </div>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="border px-2 py-1 text-sm rounded w-1/2"
        />
        
        <button className="bg-green-500 text-white px-4 py-1 rounded">
          Tìm kiếm
        </button>
      </div>
      <div className="flex space-x-2 mb-4 ml-10">
        <div className="">
                  <label htmlFor="" className="text-base font-medium pr-3">Sắp xếp theo</label>
                  <select name="category" id="" className="p-2 rounded-lg bg-white">
                      <option value="">Thời gian đăng</option>
                      <option value="">Tiêu đề</option>
                      <option value="">Danh mục</option>
                      <option value="">...</option>
                  </select>
              </div>
      </div>
      
      <div className="flex justify-center px-4">
        <table className="border-collapse border border-gray-300 text-sm w-full max-w-[95%]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Mã bài viết</th>
              <th className="border p-2">Tiêu đề</th>
              <th className="border p-2">Danh mục</th>
              <th className="border p-2">Tác giả</th>
              {status === "report" ? (
                <>
                  <th className="border p-2">Mô tả vi phạm</th>
                  <th className="border p-2">Người báo cáo</th>
                </>
              ) : (
                <th className="border p-2">Thời gian đăng</th>
              )}
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="text-center border">
                <td className="border p-2">{post.id}</td>
                <td className="border p-2 break-words whitespace-normal">{post.title}</td>
                <td className="border p-2 break-words whitespace-normal">{post.cat}</td>
                <td className="border p-2 break-words whitespace-normal">{post.author}</td>

                {status === "report" ? (
                  <>
                    <td className="border p-2 break-words whitespace-normal">{post.description}</td>
                    <td className="border p-2 break-words whitespace-normal">{post.reporter}</td>
                  </>
                ) : (
                  <td className="border p-2">{post.date}</td>
                )}

                <td className="border p-2 flex gap-2 justify-center">
                  {status === "report" ? (
                    <>
                      <Tooltip content="Xem bài">
                        <Link
                          to="/post"
                          target="_blank" // Mở trong tab mới
                          className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
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
                        <button onClick={openDeleteModal}
                         className="bg-red-500 text-white p-2 rounded">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip content="Xem bài">
                        <Link
                          to="/post"
                          target="_blank" // Mở trong tab mới
                          className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </Tooltip>

                      <Tooltip content="Chỉnh sửa">
                        <button className="bg-pink-500 text-white p-2 rounded">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>

                      {!post.approved && (
                        <Tooltip content="Duyệt bài viết" className="bg-black">
                          <button className="bg-green-500 text-white p-2 rounded">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        </Tooltip>
                      )}

                      <Tooltip content="Xóa bài">
                        <button onClick={openDeleteModal} className="bg-red-500 text-white p-2 rounded" >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>

                    </>
                  )}
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
        message={`Bạn có chắc chắn muốn xóa bài viết không?`}
        type={'post'}
      />
    </div>
  );
};

export default PostManagement;
