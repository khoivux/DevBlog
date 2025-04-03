import { useState, useEffect, useRef } from "react";
import { RiNurseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { getAuthor } from "../service/userService.js";
import { getChildComments, createComment } from "../service/commentService.js";

const Comment = ({ comment, reloadComments }) => {
  const [author, setAuthor] = useState(RiNurseFill);
  const [childComments, setChildComments] = useState([]);
  const [totalChild, setTotalChild] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false); // Trạng thái để kiểm tra nếu đang trả lời comment
  const [replyContent, setReplyContent] = useState("")
  const contentRef = useRef(null);

  const fetchAuthor = async () => {
    try {
      const response = await getAuthor(comment.authorUsername);
      if (response) {
        setAuthor(response);
      } else {
        setError("Bạn chưa đăng nhập!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchChildComments = async () => {
    try {
      const response = await getChildComments(1, pageSize, comment.id);
      if (response) {
        setChildComments(response.data);
        setTotalChild(response.totalElements);
      } else {
        setError("Không tìm thấy phản hồi!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAuthor();
    if(comment.parentId == null) {
      fetchChildComments();
    }
     
  }, [comment.authorUsername, pageSize]);

  const handleToggleReplies = async () => {
    if (!showReplies) {
      await fetchChildComments(); // Fetch khi mở lần đầu
    }
    setShowReplies(!showReplies);
  };
  
    const handleReplySubmit = async () => {
      const contentToSubmit = contentRef.current.value.trim();
          try {
            const storedUser = localStorage.getItem("user");
            const user = storedUser ? JSON.parse(storedUser) : null; 
      
            if (!user?.id) {
              throw new Error("Người dùng chưa đăng nhập.");
            }
            if (!contentToSubmit.trim()) return; 
            const commentDTO = {
              content: contentToSubmit,
              postId: comment.postId,
              authorId: user.id, 
              parentId: comment.id,
            };
            const response = await createComment(commentDTO);
            contentRef.current.value = ""; 

            if(comment.parentId == null) {
              setShowReplies(true);
              fetchChildComments();
            } else {
              reloadComments();
            }
          
          } catch (error) {
            console.error("Lỗi tải bài viết:", error.message);
          }
      setReplyContent(""); // Reset ô nhập sau khi gửi
      setReplying(false); // Ẩn ô nhập
    };

  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-2 max-w-[780px]">
      <div className="flex items-center gap-4">
        <img
          src={author.avatarUrl}
          className="w-10 h-10 rounded-full object-cover"
          alt="avatar"
        />
        <Link to={`/author/${author.username}`} className="font-medium hover:text-red-500">
            {author.displayName}
        </Link>
        <span className="text-sm text-gray-500">{comment.createdTime}</span>
      </div>

      {/* Hiển thị replyTo và content cùng dòng */}
      <div className="flex items-start mt-4">
        {comment.replyTo && (
          <Link to={`/author/${comment.usernameReply}`} className="text-base font-semibold cursor-pointer hover:text-red-500 text-black mr-4">
              {comment.replyTo}
          </Link> 
        )}
        <div className="text-base pl-2">{comment.content}</div>
      </div>

      <div className="flex gap-4 mt-2">

        {/* Nút trả lời sẽ luôn hiển thị */}
        <button
          onClick={() => { setReplying(!replying) }}
          className="text-blue-500 text-sm font-medium hover:bg-blue-100 p-2 rounded-md transition-all"
        >
          {replying ? "Hủy trả lời" : "Trả lời"}
        </button>

        {/* Nút hiển thị phản hồi chỉ khi comment có parentId và có phản hồi */}
        {comment.parentId === null && totalChild > 0 && (
          <button
            className="text-blue-500 text-sm font-medium hover:bg-blue-100 p-2 rounded-md transition-all"
            onClick={() => {
              if (showReplies) {
                setPageSize(5); // Gọi hàm khi ẩn phản hồi
              }
              handleToggleReplies(); // Toggle hiển thị phản hồi
            }}
          >
            {showReplies ? "Ẩn phản hồi" : "Hiện phản hồi"}
          </button>
        )}

      </div>


       {/* Hiển thị ô nhập để trả lời khi người dùng bấm "Trả lời" */}
       {replying && (
        <div className="flex items-center justify-between gap-4 w-full mt-4">
          <textarea
            placeholder="Viết bình luận..."
            className="w-full p-4 rounded-xl border"
            ref={contentRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); 
                createComments(); 
              }
            }}
          />
          <button
            className="bg-blue-800 px-4 py-3 text-white font-medium rounded-xl disabled:opacity-50"
            onClick={handleReplySubmit}
            disabled={!contentRef}
          >
            Gửi
          </button>
        </div>
      )}

       {/* Hiển thị các phản hồi */}
      {showReplies && childComments.length > 0 && (
        <>
          <div className="mt-2 pl-6 border-l border-gray-300">
            {childComments.map((child) => (
              <Comment key={child.id} comment={child}  reloadComments={fetchChildComments}/>
            ))}
          </div>

          {totalChild > childComments.length ? (
            <button
              className="ml-auto text-blue-500 text-sm font-medium mt-2 hover:bg-blue-100 p-2 rounded-md transition-all"
              onClick={() => {
                setPageSize(pageSize + 5); // Tăng pageSize lên 5 khi nhấn nút
              }}
            >
              Hiện thêm phản hồi
            </button>
          ) : (
            <button
              className="ml-auto text-blue-500 text-sm font-medium mt-2 hover:bg-blue-100 p-2 rounded-md transition-all"
              onClick={() => {
                setShowReplies(!showReplies);
                handleToggleReplies(); // Gọi hàm khi thay đổi trạng thái showReplies
              }}
            >
              Ẩn phản hồi
            </button>
          )}

        </>
      )}
    </div>
  );
};

export default Comment;
