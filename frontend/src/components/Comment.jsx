import { useState, useEffect, useRef } from "react";
import { RiNurseFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext.jsx";
import ReportModal from "./modal/ReportModal.jsx";
import ConfirmModal from "./modal/ConfirmModal.jsx";
import { FaRegFlag, FaTrash  } from "react-icons/fa";
import { getAuthor } from "../service/userService.js";
import { createReportComment } from "../service/reportService.js";
import { getChildComments, createComment, editComment, deleteComment } from "../service/commentService.js";

const Comment = ({ comment, reloadComments }) => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;
  const isAuthor = currentUser?.username === comment.authorUsername;
  const [author, setAuthor] = useState(RiNurseFill);
  const [childComments, setChildComments] = useState([]);
  const [totalChild, setTotalChild] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [error, setError] = useState(null);
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false); // Trạng thái để kiểm tra nếu đang trả lời comment
  const [replyContent, setReplyContent] = useState("")
  const contentRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showToast } = useToast();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleReport = async (reason) => {
      if (!currentUser) {
        showToast('warning', 'Ban can dang nhap tai khoan')
        return;
      }
      const reportData = {
        commentId: comment.id,
        reason: reason,
        authorId: currentUser.id
      };
      try {
        const response = await createReportComment(reportData);
        showToast("success", response.message);
      } catch (error) {
        showToast("error", error.message);
      }
    };
  
  const handleDelete = async () => {
    if (!currentUser) {
      navigate(`/login`);
    }
     try {
      const response = await deleteComment(comment.id);
      showToast("success", response.message);
      reloadComments();
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchAuthor = async () => {
    try {
      const response = await getAuthor(comment.authorUsername);
      if (response) {
        setAuthor(response);
      } else {
        setError("Bạn chưa đăng nhập!");
        showToast('warning', 'Chưa đăng nhập tài khoản')
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

  const handleEditSubmit = async () => {
    if (!currentUser) {
      showToast('warning', 'Bạn cần đăng nhập tài khoản')
    }
    const newContent = editContent.trim();
    if (!newContent) return;

    try {
      const commentDTO = {
        id: comment.id,
        content: newContent
      };
      await editComment(commentDTO);
      setEditing(false);
      reloadComments(); // Cập nhật lại danh sách comment
    } catch (err) {
      showToast("error", error.message);
    }
  };

  const handleReplySubmit = async () => {
    const contentToSubmit = contentRef.current.value.trim();
        try {
          const storedUser = localStorage.getItem("user");
          const user = storedUser ? JSON.parse(storedUser) : null; 
    
          if (!user?.id) {
            showToast('warning', 'Bạn cần đăng nhập tài khoản')
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
          showToast("error", error.message);
        }
    setReplyContent(""); // Reset ô nhập sau khi gửi
    setReplying(false); // Ẩn ô nhập
  };

  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-2 max-w-[780px] relative">
      {/* Nút báo cáo ở góc trên bên phải */}
      <div className="absolute top-3 right-3 flex gap-2">
         {isAuthor ? (
    // Tác giả thì chỉ hiện nút Xóa
    <>
      <button
        onClick={() => setIsConfirmModalOpen(true)}
        className="text-gray-400 hover:text-red-600 text-lg"
        title="Xóa bình luận"
      >
        <FaTrash />
      </button>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này không?"
      />
    </>
  ) : currentUser?.roles?.includes("MOD") ? (
    // Không phải tác giả + là MOD thì hiện cả Xóa + Báo cáo
    <>
      <button
        onClick={() => setIsConfirmModalOpen(true)}
        className="text-gray-400 hover:text-red-600 text-lg"
        title="Xóa bình luận"
      >
        <FaTrash />
      </button>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa bình luận"
        message="Bạn có chắc chắn muốn xóa bình luận này không?"
      />
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="text-gray-400 hover:text-gray-600 text-lg"
        title="Báo cáo bình luận"
      >
        <FaRegFlag />
      </button>
      <ReportModal
        isOpen={isReportModalOpen}
        type="comment"
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </>
  ) : (
    // Không phải tác giả + không phải MOD thì chỉ hiện nút Báo cáo
    <>
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="text-gray-400 hover:text-gray-600 text-lg"
        title="Báo cáo bình luận"
      >
        <FaRegFlag />
      </button>
      <ReportModal
        isOpen={isReportModalOpen}
        type="comment"
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReport}
      />
    </>
  )}
      </div>




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
    <div className="flex items-start mt-4 w-full">
      {comment.replyTo && (
        <Link
          to={`/author/${comment.usernameReply}`}
          className="text-base font-semibold cursor-pointer hover:text-red-500 text-black mr-4"
        >
          {comment.replyTo}
        </Link>
      )}
      {editing ? (
        <div className="flex flex-col gap-2 w-full">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full p-3 rounded-xl border"
          />
          <button
            onClick={handleEditSubmit}
            className="bg-blue-600 px-4 py-2 text-white font-medium rounded-xl self-start"
          >
            Lưu thay đổi
          </button>
        </div>
      ) : (
        <div className="text-base pl-2">{comment.content}</div>
      )}
    </div>

    <div className="flex gap-4 mt-2">
      {/* Nút trả lời luôn hiển thị */}
      <button
        onClick={() => {
          setReplying(!replying);
        }}
        className="text-blue-500 text-sm font-medium hover:bg-blue-100 p-2 rounded-md transition-all"
      >
        {replying ? "Hủy trả lời" : "Trả lời"}
      </button>

      {/* Nút sửa chỉ hiển thị nếu là tác giả */}
      {isAuthor && (
        <button
          onClick={() => {
            setEditing(!editing);
            setEditContent(comment.content);
          }}
          className="text-blue-500 text-sm font-medium hover:bg-green-100 p-2 rounded-md transition-all"
        >
          {editing ? "Hủy sửa" : "Sửa"}
        </button>
      )}

      

      {/* Nút hiện/ẩn phản hồi */}
      {comment.parentId === null && totalChild > 0 && (
        <button
          className="text-blue-500 text-sm font-medium hover:bg-blue-100 p-2 rounded-md transition-all"
          onClick={() => {
            if (showReplies) setPageSize(5);
            handleToggleReplies();
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
