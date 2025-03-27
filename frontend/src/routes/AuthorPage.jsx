import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import PostList from "../components/PostList";
import Author from "../components/Author";
import { getAuthor} from "../service/userService.js";

const AuthorPage = () => {
  const { username } = useParams();
  const [author, setAuthor] = useState(null);
  const [error, setError] = useState(null);
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

  useEffect(() => {
      const fetchAuthor = async () => {
        try {
          const data = await getAuthor(username);
          if (data) {
            setAuthor(data);
          } else {
            setError("Bạn chưa đăng nhập!");
          }
        } catch (err) {
          setError(err.message);
        }
      };
  
      fetchAuthor();
    }, [username]);

  if (!author) return <p>Đang tải dữ liệu...</p>;
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      {/* Cột Author*/}
      <div className="w-full xl:w-1/4 h-fit xl:sticky top-2 mt-14">
        <Author username={username}/>
      </div>

      {/* Cột bài viết*/}
      <div className="w-full xl:w-3/4">
        {/* Tabs: Bài viết mới nhất & Bài viết nổi bật */}
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 text-lg font-medium ${
              activeTab === "newest" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => handleTabChange("newest")}
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
        <PostList authorId={author.id} sortBy={activeTab === "newest" ? "popular" : "newest"}/>
      </div>
    </div>

  )
}

export default AuthorPage