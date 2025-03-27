
import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import Topic from "../components/Topic";
import FilterSearch from "../components/FilterSearch";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
const SearchResultPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    // Lấy giá trị `query` từ URL nếu có
    const initialQuery = searchParams.get("query") || "";
    const sortBy = searchParams.get("sort") || "";
    const [searchQuery, setSearchQuery] = useState(initialQuery);
    // Cập nhật `searchQuery` khi URL thay đổi
    useEffect(() => {
        setSearchQuery(initialQuery);
    }, [initialQuery]);

    
    const handleSearch = () => {
        if (searchQuery.trim()) {
        navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
        } else {
        navigate("/search"); // Nếu rỗng thì chỉ chuyển đến /search
        }
    };

    const catId = searchParams.get("cat") ? Number(searchParams.get("cat")) : null;
    const query = searchParams.get("query")
    const [totalPosts, setTotalPosts] = useState(0);

    return (
        <div className="flex flex-col xl:flex-row gap-4">
            <div className="xl:w-4/5 mb-8">
                {/* Thanh tìm kiếm */}
                <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-custom gap-8 mb-6">
                    
                    {/* Ô tìm kiếm */}
                    <div className="bg-gray-100 p-2 rounded-full flex gap-2 w-full max-w-2xl">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="gray"
                        >
                            <circle cx="10.5" cy="10.5" r="7.5" />
                            <line x1="16.5" y1="16.5" x2="22" y2="22" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Nhấn Enter để tìm kiếm
                            placeholder="Tìm bài viết..."
                            className="bg-transparent outline-none w-full"
                        />
                        
                    </div>
                    {/* Tiêu đề */}
                    <button
                        onClick={handleSearch}
                        className="text-xl font-medium flex items-center pl-4 px-2 py-1 rounded-full cursor-pointer transition hover:bg-gray-200"
                    >
                        Tìm kiếm
                    </button>

                </div>
                <p className="text-gray-600 text-base mt-2 pl-3 font-medium">
                    Có {totalPosts} kết quả tìm kiếm
                </p>
                <hr className="border-gray-300 mb-8 shadow-custom" />
                {/* Danh sách bài viết */}
                <PostList 
                    categoryId={catId} 
                    query={query} 
                    setTotalPosts={setTotalPosts}
                    sortBy={sortBy}
                />
            </div>

            
            {/* Topic*/}
            <div className="xl:w-1/5 h-fit ">
            
                <div className="relative top-3">
                    <FilterSearch />
                </div>
                <div className="relative top-6">
                    <Topic />
                </div>
            </div>
        </div>
    );
  };
  
  export default SearchResultPage;