import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import ConfirmModal from "./modal/ConfirmModal";
import ReportModal from "./modal/ReportModal";
import { useToast } from "../contexts/ToastContext";
import { FaRegFlag } from "react-icons/fa";
import { deletePost } from "../service/postService";
import { createReportPost } from "../service/reportService";
const PostListItem = ({ post, currentUser, onDeleteSuccess }) => {
  const isAuthor = currentUser?.username === post.authorUsername;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const { showToast } = useToast();

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };
  
  const handleConfirm = async () => {
      try {
          const response = await deletePost(post.id)
          onDeleteSuccess?.();
        showToast("success", response.message);
      } catch (error) {
        showToast("error", error.message);
      } finally {
        closeConfirmModal();
      }
    };

  const handleReport = async (reason) => {
    const reportData = {
      postId: post.id,
      reason: reason,
    };
    try {
      const response = await createReportPost(reportData);
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    }
  };


  useEffect(() => {
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex flex-col xl:flex-row gap-8 mb-4 shadow-custom rounded-xl p-3 bg-white">
         {/* Three dots menu */}
        {/* Three dots menu */}
        {isAuthor ? (
          <div className="absolute top-3 right-3 z-50" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="cursor-pointer text-2xl w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black+"
            >
              ⋮
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <Link
                  to={`/edit/${post.id}`}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Sửa bài viết
                </Link>
                <button
                  onClick={() => {
                    setIsConfirmModalOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Xóa bài viết
                </button>
              </div>
            )}
          </div>
        ) : (
            <>
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg"
                title="Báo cáo bài viết"
              >
                <FaRegFlag />
              </button>

              <ReportModal
                isOpen={isReportModalOpen}
                type="post"
                onClose={() => setIsReportModalOpen(false)}
                onSubmit={handleReport}
              />
            </>
        )}

        {/* image */}
        <div className="md:hidden xl:block xl:w-1/2">
            <img src={post.thumbnailUrl} className="rounded-xl object-cover" width="735 border-2 border-gray-200" />
        </div>

        {/* details */}
        <div className="flex flex-col gap-2 xl:w-1/2">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Link
                to={`/search?cat=${post.category.id}`}
                className='text-white small-text lg:small-text rounded-3xl p-3 py-2 bg-[#44D6FF] hover:scale-105'>
                {post.category.name}
              </Link>
            </div>
            <Link to={`/post/${post.id}`} className="text-2xl font-semibold hover:text-blue-900">
              {post.title}
            </Link>
            <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
            <span>Viết bởi</span>
            <Link to={`/author/${post.authorUsername}`} className="text-blue-500 hover:underline hover:text-red-500">
              {post.authorName}
            </Link>
            <span> |  {post.createdTime} </span>
            </div>
            <p className='pr-4'>
              {post.description.length > 130 ? `${post.description.slice(0, 130)}...` : post.description}
            </p>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Link
                to={`/post/${post.id}`}
                className="text-white small-text lg:small-text rounded-3xl p-3 py-2 bg-[#0EE719] hover:scale-105"
              >
                Đọc thêm
              </Link>
              {post.status === 'pending' ? (
                <span className="inline-block px-4 py-2 text-yellow-800 bg-yellow-100 rounded-full text-sm font-medium">
                  Đang chờ duyệt
                </span>
              ) : post.status === 'hide' ? (
                <span className="inline-block px-4 py-2 text-yellow-800 bg-yellow-100 rounded-full text-sm font-medium">
                  Đang ẩn
                </span>
              ) : null}

            </div>
        </div>

        <ConfirmModal
              isOpen={isConfirmModalOpen}
              onClose={closeConfirmModal}
              onConfirm={handleConfirm}
              title={"Xác nhận xóa bài viết"}
              message={"Bạn có chắc chắn muốn xóa bài viết này không?"}
        />
    </div>

      
  );
};

export default PostListItem