// src/components/modal/EditCategoryModal.jsx
import React from "react";

const EditCategoryModal = ({ isOpen, onClose, category, onChange, onSave }) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Chỉnh sửa danh mục</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700">Mã danh mục</label>
          <input
            type="text"
            value={category.id}
            disabled
            className="mt-1 w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên danh mục</label>
          <input
            type="text"
            value={category.name}
            onChange={(e) => onChange({ ...category, name: e.target.value })}
            className="mt-1 w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Hủy
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryModal;
