import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MainCategories from "../components/MainCategories";
import FeaturedPosts from "../components/FeaturedPosts";
import PostList from "../components/PostList";
import Pagination from "../components/PaginationComponent";
import Topic from "../components/Topic";
const Homepage = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [activeTab, setActiveTab] = useState("newest");
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setLoading(true); // Bắt đầu loading
      setTimeout(() => {
        setActiveTab(tab); // Đổi tab sau khi loading hoàn tất
        setLoading(false);
      }, 200); // Giả lập delay 0.5s để tránh cảm giác giật
    }
  };


  // Theo dõi vị trí cuộn
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScroll(true);
      } else {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hàm trở về đầu trang
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="mt-4 flex flex-col gap-4">
      {/* BREADCRUMB */}
      <div className="flex gap-4">
        <Link to="/">Trang chủ</Link>
        <span>•</span>
        <span className="text-blue-800">Bài viết</span>
      </div>

      {/* INTRODUCTION */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="w-4/5 text-gray-800 text-2xl md:text-5xl lg:text-5xl font-bold">
          Cộng đồng chia sẻ và thảo luận kiến thức lập trình, từ cơ bản đến nâng cao.
          </h1>
          <p className="mt-8 w-4/5 text-md md:text-xl">
          Tham gia cộng đồng, kết nối với những người đam mê công nghệ và khám phá lập trình sáng tạo.
          </p>
        </div>
      </div>

      {/* CATEGORIES */}
      <MainCategories />

      {/* FEATURED POSTS */}
      <FeaturedPosts />

      {/* Tabs: Bài viết mới nhất & Bài viết nổi bật */}
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "latest" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => handleTabChange("latest")}
        >
          Bài viết mới nhất
        </button>
        <button
          className={`px-4 py-2 text-lg font-medium ${
            activeTab === "popular" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}
          onClick={() => handleTabChange("popular")}
        >
          Bài viết nổi bật
        </button>
      </div>

      {/* POST LIST */}
      <div className="flex flex-col xl:flex-row gap-4">
          {/* Danh sách bài viết*/}
          <div className="xl:w-4/5">
              <PostList sortBy={activeTab}/>
          </div>

          {/* Topic*/}
          <div className="xl:w-1/5 h-fit xl:sticky top-4">
              <Topic />
          </div>
      </div>

      {/* Nút trở về đầu trang */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="shadow-custom fixed bottom-16 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
          title="Trở về đầu trang"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Homepage;
