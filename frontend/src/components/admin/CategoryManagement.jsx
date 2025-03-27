import { useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Tooltip } from "@material-tailwind/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import Modal from "react-modal";
const CategoryManagement = () => {
  const [sortOrder, setSortOrder] = useState("asc");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("Lập trình");

  // Mở modal chỉnh sửa
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  // Mở modal xác nhận xóa
  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  const handleSave = () => {
    console.log("Lưu danh mục:", categoryName);
    closeModal();
  };

   // Xác nhận xóa danh mục
   const handleDelete = () => {
    console.log("Danh mục đã bị xóa:", categoryName);
    closeDeleteModal();
  };


  const categories = [
    { id: 1, name: "Thuật toán", postCount: 12 },
    { id: 2, name: "Java", postCount: 8 },
    { id: 3, name: "Game", postCount: 15 },
  ];

  // Sắp xếp theo số lượng bài viết
  const sortedCategories = [...categories].sort((a, b) =>
    sortOrder === "asc" ? a.postCount - b.postCount : b.postCount - a.postCount
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý danh mục</h2>
      </div>
      {/* Ô thêm danh mục */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Tên danh mục mới"
          className="border px-2 py-1 text-sm rounded w-1/2"
        />
        
        <button className="bg-green-500 text-white px-4 py-1 rounded">
          Thêm mới
        </button>
      </div>
      <table className="w-full border-collapse border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Mã danh mục</th>
            <th className="border px-2 py-1">Tên</th>
            <th className="border px-2 py-1 cursor-pointer flex items-center justify-center"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Số lượng bài viết
              {sortOrder === "asc" ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />}
            </th>
            <th className="border px-2 py-1">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((category, index) => (
            <tr key={category.id} className="text-center border">
              <td className="border">{category.id}</td>
              <td className="border">{category.name}</td>
              <td className="border">{category.postCount}</td>
              <td className="border py-1 space-x-1">
                <Tooltip content="Chỉnh sửa">
                  <button
                    onClick={openEditModal}
                    className="bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Xóa bài">
                  <button onClick={openDeleteModal}
                  className="bg-red-500 text-white p-2 rounded">
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      {/* Modal Chỉnh sửa danh mục */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Chỉnh sửa danh mục"
        className="bg-white p-6 rounded-xl shadow-lg w-[400px] border border-gray-300 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-center mb-4">Chỉnh sửa danh mục</h2>
        {/* Input Nhập tên danh mục */}
        <div>
          <label className="block font-semibold mb-1">Tên danh mục</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Nút Hủy & Lưu */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={closeEditModal} className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">
            Hủy
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Lưu thay đổi
          </button>
        </div>
      </Modal>

      {/* Modal Xác nhận xóa danh mục */}
      <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={closeDeleteModal}
        contentLabel="Xác nhận xóa danh mục"
        className="bg-white p-6 rounded-xl shadow-lg w-[350px] border border-gray-300 outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-xl font-bold text-center mb-4 text-red-600">
          Xóa danh mục
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Bạn có chắc chắn muốn xóa danh mục <b>{categoryName}</b> không?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
          >
            Hủy
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Xóa
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
