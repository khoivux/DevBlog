import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getCategories } from "../service/categoryService.js";

const Topic = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy cat hiện tại từ URL
  const currentCat = searchParams.get("cat");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 1000, "");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error.message);
      }
    };

    fetchCategories();
  }, []);

  // Xử lý khi chọn danh mục
  const handleCategoryClick = (categoryId) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("cat", categoryId); // Cập nhật hoặc thêm cat vào URL
    navigate(`/search?${newParams.toString()}`);
  };

  return (
    <div className="bg-white shadow-custom rounded-xl p-4 h-fit">
      <h2 className="text-xl text-center font-semibold mb-4 border-b pb-2">Chủ đề</h2>
      <ul className="space-y-3 pb-2">
        {categories.map((category, index, arr) => (
          <li key={category.id || index}>
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`text-ellipsis text-sm font-light hover:underline ${
                currentCat === String(category.id) ? "text-purple-600 font-semibold" : ""
              }`}
            >
              {category.name}
            </button>
            {index !== arr.length - 1 && <hr className="border-gray-300 mt-1" />}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Topic;
