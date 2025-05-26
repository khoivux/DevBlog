import { useState, useEffect, useRef } from "react";
import { useToast } from "../../contexts/ToastContext";
import { FaSortUp, FaSortDown } from "react-icons/fa";
import { Tooltip } from "@material-tailwind/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { getCategories, createCategory, deleteCat, updateCategory } from "../../service/categoryService";
import { Pagination } from "antd";
import ConfirmDeleteModal from "../modal/ConfirmModal";
import EditCategoryModal from "../modal/EditCategory";
import CustomPagination from "../CustomPagination";
const CategoryManagement = () => {
  const [error, setError] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [categories, setCategories] = useState([]);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [catQuery, setCatQuery] = useState("");
  const inputRef = useRef(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { showToast } = useToast();

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };
  
  const closeDeleteModal = () => {
    setSelectedCategory(null);
    setIsDeleteModalOpen(false);
  };

  const openEditModal = (category) => {
    setSelectedCategory({ ...category });
    setIsEditModalOpen(true);
  };
  
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories(currentPage, pageSize, catQuery);
      setCategories(response.data.data);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      showToast("error", error.message);
    }
  };
  const handleCreate = async () => {
    try {
      const response = await createCategory(newCategoryName.trim());
      setNewCategoryName("");
      fetchCategories();
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await updateCategory(selectedCategory);
      fetchCategories();
      closeEditModal();
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };
  
  const handleConfirmDelete = async () => {
    if (!selectedCategory) return;
    try {
      const response = await deleteCat(selectedCategory.id);
      fetchCategories();
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      closeDeleteModal();
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, [currentPage, pageSize, catQuery]);

  const sortedCategories = [...categories].sort((a, b) =>
    sortOrder === "asc" ? a.countPosts - b.countPosts : b.countPosts - a.countPosts
  );

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Quản lý danh mục</h2>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
      </div>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Tên danh mục"
          className="border px-2 py-1 text-sm rounded w-1/2"
          value={catQuery}
          onChange={(e) => setCatQuery(e.target.value)}
        />
        
        <button
          className="bg-green-500 text-white px-4 py-1 rounded"
        >
          Tìm kiếm
        </button>
      </div>
      {/* Ô thêm danh mục */}
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Tên danh mục mới"
          className="border px-2 py-1 text-sm rounded w-1/2"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        
        <button
          className="bg-green-500 text-white px-4 py-1 rounded"
          onClick={handleCreate}
        >
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
          {sortedCategories.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            sortedCategories.map((category) => (
              <tr key={category.id} className="text-center border">
                <td className="border">{category.id}</td>
                <td className="border">{category.name}</td>
                <td className="border">{category.countPosts}</td>
                <td className="border py-1 space-x-1">
                  <Tooltip content="Chỉnh sửa">
                    <button className="bg-green-500 text-white p-2 rounded hover:bg-pink-600 transition"
                    onClick={() => openEditModal(category)}>
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Xóa bài">
                  <button
                    className="bg-red-500 text-white p-2 rounded"
                    onClick={() => openDeleteModal(category)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {totalElements > 0 && (
      <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalElements={totalElements}
          />
        </div>)}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa danh mục"
        message={`Bạn có chắc muốn xóa danh mục "${selectedCategory?.name}"?\nTất cả bài viết thuộc danh mục này sẽ bị xóa.`}
      />
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        category={selectedCategory}
        onChange={setSelectedCategory}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default CategoryManagement;
