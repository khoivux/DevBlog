import { Link} from "react-router-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../contexts/ToastContext.jsx";
import Topic from "../components/Topic";
import Author from "../components/Author";
import Comments from "../components/Comments";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { getSinglePost, votePost, checkVote } from "../service/postService.js";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";


hljs.configure({
    languages: ["javascript", "python", "css", "java", "php", "ruby", "go", "bash", "json", "yaml"]
});
const SinglePostPage = () => {
    const { postId } = useParams();
    const storedUser = localStorage.getItem("user");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;
    const [isAuthor, setIsAuthor] = useState(false)
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");
    const [likes, setLikes] = useState(0);
    const [typeLike, setTypeLike] = useState(null);
    const [showScroll, setShowScroll] = useState(false);
    const [searchQuery, setSearchQuery] = useState(null);
    const {showToast} = useToast()
    const navigate = useNavigate();
    
    

    const fetchPost = async () => {
      try {
        const data = await getSinglePost(postId);
        if (data) {
          setPost(data);
          
        } else {
          setError("Bạn chưa đăng nhập!");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchVoteType = async () => {
      try {
        const type = await checkVote(postId);
        if (type) {
          setTypeLike(type);
        } else {
          setError("Bạn chưa đăng nhập!");
        }
      } catch (err) {
        setError(err.message);
      }
    };
  
    const handleVote = async (type) => {
      if (!post) return; // Đảm bảo post đã có dữ liệu trước khi vote
  
      const oldLikes = likes; // Lưu trạng thái cũ để rollback nếu lỗi
      const newVoteType = typeLike === type ? "NONE" : type;
      // Cập nhật state ngay lập tức để UI thay đổi ngay
      
      try {
        const result = await votePost(postId, newVoteType);
        fetchPost()
        fetchVoteType()
        console.log("Vote thành công:", result);
      } catch (error) {
        showToast('warning', error.message)
        setLikes(oldLikes); // Rollback state nếu API lỗi
      }
    };

    const handleSearch = () => {
      if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      } else {
      navigate("/search"); // Nếu rỗng thì chỉ chuyển đến /search
      }
  };


    useEffect(() => {
      fetchPost()
      fetchVoteType()
    }, [postId]);
    
    useEffect(() => {
    if (post && currentUser) {
      setIsAuthor(currentUser.username === post.authorUsername);
    }
  }, [post, currentUser]);

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

  if (!post) return <p>Đang tải bài viết...</p>;

  return (
  <div className="flex flex-col gap-8">
    {/* Main Section: Details & Content */}
    <div className="flex gap-4">
      <div className="w-3/4 flex flex-col gap-4 relative">
        {/* Nút Sửa và Xóa nếu là tác giả */}
        {isAuthor && (
          <div className="absolute top-0 right-0 z-50 flex gap-2 p-2">
            <Link
              to={`/edit/${post.id}`}
              className="bg-blue-300 text-white px-3 py-1 rounded hover:bg-yellow-500"
            >
              Sửa
            </Link>
            <button
              onClick={() => setIsConfirmModalOpen(true)}
              className="bg-red-300 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Xóa
            </button>
          </div>
        )}

        {/* Detail */}
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-gray-400 text-base">
            <span>Viết bởi</span>
            <Link to={`/author/${post.authorUsername}`} className="text-blue-800 hover:text-red-500 hover:underline">
              {post.authorName}
            </Link>
            <span>|</span>
            <span>{post.createdTime}</span>
          </div>
          <div className="hidden lg:block">
            <img src={post.thumbnailUrl} width="800" className="rounded-2xl" alt="Post Image" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-12">
          <div className="content lg:text-lg flex flex-col gap-6 text-justify">
            <div
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/<\/pre>\n<pre><code>/g, "</code></pre>\n<pre><code>")
              }}
            />
            {post.status === 'approved' && (
              <div className="flex justify-end items-center gap-4 p-4 border-t">
                <button
                  onClick={() => handleVote(typeLike === "LIKE" ? "NONE" : "LIKE")}
                  className={`flex items-center gap-2 ${
                    typeLike === "LIKE" ? "text-blue-500" : "text-gray-500"
                  } hover:text-blue-500`}
                >
                  <FaThumbsUp size={20} /> <span>{post.like}</span>
                </button>
                <button
                  onClick={() => handleVote(typeLike === "DISLIKE" ? "NONE" : "DISLIKE")}
                  className={`flex items-center gap-2 ${
                    typeLike === "DISLIKE" ? "text-red-500" : "text-gray-500"
                  } hover:text-red-500`}
                >
                  <FaThumbsDown size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Topic Section */}
      <div className="w-1/4 px-3 min-h-screen mt-11 flex flex-col">
        <div className="hidden md:flex bg-white rounded-3xl xl:rounded-full p-4 shadow-custom gap-8 mb-4">
          <div className="bg-gray-100 p-2 rounded-full flex gap-2 w-full max-w-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="gray">
              <circle cx="10.5" cy="10.5" r="7.5" />
              <line x1="16.5" y1="16.5" x2="22" y2="22" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Tìm bài viết..."
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <Author username={post.authorUsername} />
        </div>

        {/* Topic sticky */}
        <div className="xl:sticky top-2">
          <Topic />
        </div>
      </div>
    </div>

    {post.status === 'approved' && <Comments postId={postId} />}

    {/* Nút trở về đầu trang */}
    {showScroll && (
      <button
        onClick={scrollToTop}
        className="shadow-custom fixed bottom-16 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center"
        title="Trở về đầu trang"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    )}
  </div>
);

};

export default SinglePostPage;
