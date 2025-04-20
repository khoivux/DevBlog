import { useSearchParams, useNavigate } from "react-router-dom";

const FilterSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const filterOptions = [
    { label: "Mới nhất", value: "latest" },
    { label: "Cũ nhất", value: "oldest" },
    { label: "Phổ biến nhất", value: "popular" },
    { label: "Tác giả theo dõi", value: null }
  ];

  // Lấy giá trị sortBy từ URL (nếu có)
  const currentSort = searchParams.get("sort") || "";

  const handleFilterChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("sort", value); // Cập nhật giá trị `sortBy`
    navigate(`/search?${newParams.toString()}`); // Chuyển hướng với tham số mới
  };

  return (
    <div className="bg-white shadow-custom rounded-[40px] p-4 h-fit">
      <h2 className="text-xl text-center font-semibold mb-4 border-b pb-2">Bộ lọc</h2>
      <ul className="space-y-3 pb-2">
        {filterOptions.map(({ label, value }, index) => (
          <div key={value}>
            <li className="flex items-center gap-4">
              <input
                type="radio"
                name="filterOption"
                className="w-4 h-4 accent-[#3B3B3B]"
                checked={currentSort === value}
                onChange={() => handleFilterChange(value)}
              />
              <span className="text-ellipsis font-light">{label}</span>
            </li>
            {/* Chỉ thêm hr nếu không phải item cuối */}
            {index !== filterOptions.length - 1 && <hr className="border-gray-300 mt-2" />}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default FilterSearch;
