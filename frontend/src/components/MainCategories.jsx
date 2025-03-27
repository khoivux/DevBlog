import { Link, useNavigate } from "react-router-dom";
import Search from "./Search";
import { useEffect, useState } from "react";
import { getCategories } from "../service/categoryService.js";

const MainCategories = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Lưu nội dung tìm kiếm
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/search?cat=${category.id}`);
  };

  const handleSearch = (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate(`/search?query=${encodeURIComponent(trimmedQuery)}`);
    } else {
      navigate("/search"); // Nếu rỗng thì chỉ chuyển đến /search
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories(1, 4, "");
        setCategories(response.data.data);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error.message);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-lg items-center justify-center gap-8">
      {/* Links */}
      <div className="flex-1 flex items-center justify-between flex-wrap">
        <Link
          to="/search"
          className="bg-blue-800 text-white rounded-full px-4 py-2 hover:scale-105"
        >
          Tất cả bài viết
        </Link>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className="hover:bg-blue-50 rounded-full px-4 py-2 hover:scale-105"
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Nút tìm kiếm */}
      <button
        onClick={() => handleSearch(searchQuery)} // Gọi tìm kiếm khi bấm nút
        className="hover:bg-blue-50 rounded-full px-4 py-2 hover:scale-105"
      >
        <span className="text-xl font-medium">Tìm kiếm</span>
      </button>

      {/* Search Component */}
      <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} onSearch={handleSearch} />
    </div>
  );
};

export default MainCategories;
