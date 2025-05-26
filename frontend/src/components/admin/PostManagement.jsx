import { Tooltip } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import ConfirmModal from "../modal/ConfirmModal";
import { useToast } from "../../contexts/ToastContext";
import { EyeIcon, TrashIcon,CheckIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { getPosts, deletePost } from "../../service/postService";
import { getCategories } from "../../service/categoryService";
import { updateStatus } from "../../service/adminService";
import PostView from "../modal/PostView";
import CustomPagination from "../CustomPagination";
import { Link } from "react-router-dom";
import { getReportPost, handleReportPost } from "../../service/reportService";
const PostManagement = ({ status }) => {
  const [posts, setPosts] = useState([]);
  const [report, setReport] = useState([])
  const [categoryId, setCategoryId] = useState(null);
  const [sortBy, setSortBy] = useState(null);
  const [query, setQuery] = useState(null);
  const [pageSize, setPageSize] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [categories, setCategories] = useState([]);
  const { showToast } = useToast();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedItem, setselectedItem] = useState(null);
  const [confirmType, setConfirmType] = useState(null); // "approve" | "reject"
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openConfirmModal = (post, type) => {
    setselectedItem(post);
    setConfirmType(type); // "approve" hoặc "reject"
    setIsConfirmModalOpen(true);
  };
  
  const closeConfirmModal = () => {
    setselectedItem(null);
    setConfirmType(null);
    setIsConfirmModalOpen(false);
  };
  


  const openViewModal = (post) => {
    setselectedItem(post);
    setIsViewModalOpen(true);
  };
  
  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setselectedItem(null);
  };
  


  const fetchPosts = async () => {
    try{
      let response;
      if (status === "report") {
        response = await getReportPost(currentPage, pageSize, query, categoryId, sortBy);
        setReport(response.data.data);
        setTotalElements(response.data.totalElements);
        return;
      } else {
        response = await getPosts(currentPage, pageSize, query, categoryId, sortBy, status);
      }
      

      setPosts(response.data.data.filter((post) => post.status === status));
      setTotalElements(response.data.totalElements);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategories(1, 1000, null);
      setCategories(response.data.data);
    } catch (error) {
      showToast("error", error.message);
    }
  };

  const handleConfirm = async () => {
    try {
      let response;

      if (status === "report" && confirmType === "approved") {
        // Xử lý báo cáo
        response = await handleReportPost(selectedItem.id, confirmType);
      } else {
        // Xử lý bài viết thường
        if (confirmType === "approved" || confirmType === "rejected") {
          response = await updateStatus(selectedItem.id, confirmType, null);
        } else if(confirmType === "hide") {
          response = await updateStatus(selectedItem.post.id, confirmType, selectedItem.reason);
          const temp = await handleReportPost(selectedItem.id, "approved")
        } 
      }

      showToast("success", response.message);
      fetchPosts();
    } catch (error) {
      showToast("error", error.message);
    } finally {
      closeConfirmModal();
    }
  };

  

  useEffect(() => {
      fetchPosts();
    }, [currentPage, pageSize, query, categoryId, sortBy, status]);

    useEffect(() => {
      fetchCategories();
    }, [status]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4">
        {status === "approved"
          ? "Bài viết đã duyệt"
          : status === "pending"
          ? "Bài viết chưa duyệt"
          : status === "hide"
          ? "Bài viết đã ẩn"
          : "Báo cáo vi phạm"}
      </h2>
      <div className="flex items-center space-x-4 mb-4 ml-10">
        <div className="flex items-center space-x-2">
          <label htmlFor="category" className="text-base font-medium">Danh mục</label>
          <select
            name="category"
            id="category"
            className="p-2 rounded-lg bg-white border text-sm"
            value={categoryId || ""}
            onChange={(e) => {
              setCategoryId(e.target.value || null);
              setCurrentPage(1); // reset về trang đầu khi lọc
            }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

        </div>

        <input
          type="text"
          placeholder="Nhập tên bài viết..."
          className="border px-2 py-2 text-sm rounded w-1/2"
          value={query || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
          }}
        />

      </div>

      <div className="flex space-x-2 mb-4 ml-10">
        <div className="">
                  <label htmlFor="" className="text-base font-medium pr-3">Sắp xếp theo</label>
                  <select
                    name="sortBy"
                    id="sortBy"
                    className="p-2 rounded-lg bg-white"
                    value={sortBy || ""}
                    onChange={(e) => {
                      setSortBy(e.target.value || null);
                      setCurrentPage(1); // reset về trang đầu
                    }}
                  >
                    <option value="">-- Chọn sắp xếp --</option>
                    <option value="latest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="popular">Phổ biến nhất</option>
                  </select>
              </div>
      </div>
      
      <div className="flex justify-center px-4">
        <table className="border-collapse border border-gray-300 text-sm w-full max-w-[95%]">
          <thead>
          <tr className="bg-gray-200">
            {status === "report" ? (
              <>
                <th className="border p-2">Mã báo cáo</th>
                <th className="border p-2">Bài viết</th>
                <th className="border p-2">Nội dung vi phạm</th>
                <th className="border p-2">Thời gian báo cáo</th>
              </>
            ) : (
              <>
                <th className="border p-2">Tiêu đề</th>
                <th className="border p-2">Danh mục</th>
                <th className="border p-2">Tác giả</th>
                <th className="border p-2">Thời gian đăng</th>
              </>
            )}
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>


          <tbody>
  {status === "report"
    ? report.map((report) => (
        <tr key={report.id} className="text-center border">
          <td className="border p-2">{report.id}</td>
          <td className="border p-2 break-words whitespace-normal">
            <Link to={`/post/${report.post.id}`} className="hover:text-blue-600">
              {report.post.title}
            </Link>
          </td>
          <td className="border p-2 break-words whitespace-normal">{report.reason}</td>
          <td className="border p-2">{report.createdTime}</td>
          <td className="border p-2 flex gap-2 justify-center">
            <Tooltip content="Xem bài">
              <a
                href={`/post/${report.post.id}`}
                target="_blank"
                rel="noopener noreferrer" 
                className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
              >
                <EyeIcon className="h-4 w-4" />
              </a>
            </Tooltip>
            <Tooltip content="Ẩn bài viết">
              <button
                onClick={() => openConfirmModal(report, "hide")}
                className="bg-gray-500 text-white p-2 rounded"
              >
                <XCircleIcon className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Đã xử lý">
              <button
                onClick={() => openConfirmModal(report, "approved")}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            </Tooltip>
          </td>
        </tr>
      ))
    
     : status === "hide"
      ? posts.map((post) => (
          <tr key={post.id} className="text-center border">
            <td className="border p-2 break-words whitespace-normal">
              <Link to={`/post/${post.id}`} className="hover:text-blue-600">
                {post.title}
              </Link>
            </td>
            <td className="border p-2 break-words whitespace-normal">{post.category.name}</td>
            <td className="border p-2 break-words whitespace-normal">
              <Link to={`/author/${post.authorUsername}`} className="hover:text-blue-600">
                {post.authorName}
              </Link>
            </td>
            <td className="border p-2">{post.createdTime}</td>
            <td className="border p-2 flex gap-2 justify-center">
              <Tooltip content="Xem bài">
                <button
                  onClick={() => openViewModal(post)}
                  className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                >
                  <EyeIcon className="h-4 w-4" />
                </button>
              </Tooltip>
              <Tooltip content="Duyệt bài viết">
                <button
                  onClick={() => openConfirmModal(post, "approved")}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
              </Tooltip>
              <Tooltip content="Xóa bài">
                <button
                  onClick={() => openConfirmModal(post, "delete")}
                  className="bg-red-500 text-white p-2 rounded"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </Tooltip>
            </td>
          </tr>
      ))
    
      : posts.map((post) => (
        <tr key={post.id} className="text-center border">
          <td className="border p-2 break-words whitespace-normal">
            <Link to={`/post/${post.id}`} className="hover:text-blue-600">
              {post.title}
            </Link>
          </td>
          <td className="border p-2 break-words whitespace-normal">{post.category.name}</td>
          <td className="border p-2 break-words whitespace-normal">
            <Link to={`/author/${post.authorUsername}`} className="hover:text-blue-600">
              {post.authorName}
            </Link>
          </td>
          <td className="border p-2">{post.createdTime}</td>
          <td className="border p-2 flex gap-2 justify-center">
            {status === "pending" ? (
              <>
                <Tooltip content="Xem bài">
                  <button
                    onClick={() => openViewModal(post)}
                    className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Duyệt bài">
                  <button
                    onClick={() => openConfirmModal(post, "approved")}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Từ chối">
                  <button
                    onClick={() => openConfirmModal(post, "rejected")}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip content="Xem bài">
                  <button
                    onClick={() => openViewModal(post)}
                    className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
                <Tooltip content="Xóa bài">
                  <button
                    onClick={() => openConfirmModal(post, "delete")}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </Tooltip>
              </>
            )}
          </td>
        </tr>
      ))}
</tbody>


        </table>
      </div>

      {totalElements > 0 && (
        <div className="flex justify-center">
          <CustomPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalElements={totalElements}
          />
        </div>
      )}

      <PostView
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        post={selectedItem}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleConfirm}
        title={
          confirmType === "approved"
            ? "Xác nhận duyệt bài viết"
            : confirmType === "rejected"
            ? "Xác nhận từ chối bài viết"
            : confirmType === "hide"
            ? "Xác nhận ẩn bài viết"
            : "Xác nhận xóa bài viết"
        }
        message={
          confirmType === "approved"
            ? "Bạn có chắc chắn muốn duyệt bài viết này không?"
            : confirmType === "rejected"
            ? "Bạn có chắc chắn muốn từ chối bài viết này không?"
            : confirmType === "hide"
            ? "Bạn có chắc chắn muốn ẩn bài viết này"
            : "Bạn có chắc chắn muốn xóa bài viết này không?"
        }
      />



      
    </div>
  );
};

export default PostManagement;
