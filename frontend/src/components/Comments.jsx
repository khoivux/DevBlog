import { useState, useEffect, useRef } from "react";
import Comment from "./Comment";
import { getComments, createComment } from "../service/commentService.js";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext.jsx";
const Comments = ({ postId }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const [parentId, setParentId] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(5);
  const [totalComments, setTotalComments] = useState(0);; // Quản lý số lượng bình luận hiển thị
  const contentRef = useRef();
  const { showToast } = useToast();

  const fetchComments = async () => {
    try {
      const response = await getComments(1, pageSize, postId, null);
      setComments(response.data);
      setTotalComments(response.totalElements)
    } catch (error) {
      console.error("Lỗi tải bài viết:", error.message);
    }
    setLoading(false);
  };

  const createComments = async () => {
    if (!currentUser) {
        showToast('warning', 'Bạn cần đăng nhập tài khoản')
    }
    const contentToSubmit = contentRef.current.value.trim();
    try {
      const storedUser = localStorage.getItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null; // Kiểm tra trước khi parse

      if (!user?.id) {
        throw new Error("Người dùng chưa đăng nhập.");
      }
      if (!contentToSubmit.trim()) return; // Kiểm tra nội dung bình luận
      const commentDTO = {
        content: contentToSubmit,
        postId,
        authorId: user.id, // Lấy ID từ user đã đăng nhập
        parentId,
      };
      const response = await createComment(commentDTO);
      contentRef.current.value = ""; // Xóa nội dung textarea sau khi gửi
      fetchComments(); // Cập nhật danh sách bình luận
    } catch (error) {
      console.error("Lỗi tải bài viết:", error.message);
    }
    setLoading(false);
  };

  // Hàm để hiển thị thêm bình luận
  const loadMoreComments = () => {
    setPageSize(pageSize + 5); // Tăng số lượng bình luận cần hiển thị thêm mỗi lần
  };

  useEffect(() => {
    fetchComments();
  }, [postId, pageSize]); // Cập nhật khi `postId` hoặc `pageSize` thay đổi

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="flex flex-col gap-4 lg:w-3/4 mb-4">
      <h1 className="text-xl text-gray-500 underline">Comments</h1>
      <div className="flex items-center justify-between gap-4 w-full">
        <textarea
          placeholder="Viết bình luận..."
          className="w-full p-4 rounded-xl border"
          ref={contentRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // Ngăn chặn hành động mặc định (ngắt dòng)
              createComments(); // Gọi hàm createComment khi nhấn Enter
            }
          }}
        />
        <button
          className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50"
          onClick={createComments}
        >
          Gửi
        </button>
      </div>

      {/* Hiển thị danh sách bình luận */}
      <div>
        {comments.slice(0, pageSize).map((comment) => (
          <Comment key={comment.id} comment={comment} reloadComments={fetchComments}/>
        ))}
      </div>

      {/* Hiển thị nút "Hiển thị thêm" nếu còn bình luận để hiển thị */}
      {
        totalComments >= pageSize ? (
          totalComments > pageSize ? (
            <button
              className="mt-4 pr-20 text-black font-semibold py-2 px-4 rounded-xl"
              onClick={loadMoreComments}
            >
              Hiển thị thêm
            </button>
          ) : null 
          ) : (
            totalComments <= 5 ? (
              null
            ) : (  <button
                className="mt-4 pr-20 text-black font-semibold py-2 px-4 rounded-xl"
                onClick={() => {
                  setPageSize(5); // Đặt lại pageSize về 5 khi nhấn nút
                  fetchComments(); // Gọi lại fetchComments sau khi thay đổi pageSize
                }}
              >
                Ẩn
              </button>
            )
          )
      }
    </div>
  );
};

export default Comments;
