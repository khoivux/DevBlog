import PostListItem from "../components/PostListItem";
import { Pagination,Select  } from "antd";
import { useEffect, useState } from "react";
import { getPosts, getPostsByAuthorId } from "../service/postService.js";
import CustomPagination from "./CustomPagination.jsx";

const PostList = ({
  page = 1,
  size = 5,
  query = null,
  categoryId = null,
  sortBy = "latest",
  status = "APPROVED",
  authorId = null,
  setTotalPosts,
}) => {
  const [currUser, setCurrUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize, setPageSize] = useState(size);

  const fetchPosts = async () => {
  setLoading(true);
  try {
    let response;
    if (authorId) {
      response = await getPostsByAuthorId(sortBy, authorId, currentPage, pageSize);
    } else {
      response = await getPosts(currentPage, pageSize, query, categoryId, sortBy, status);
    }

    const { totalPage, totalElements, data } = response.data;
    setPosts(data);
    setTotalPages(totalPage);
    setTotalElements(totalElements);
    setTotalPosts(totalElements);
  } catch (error) {
    console.error("Lỗi tải bài viết:", error.message);
  }
  setLoading(false);
};
  
  useEffect(() => {
  fetchPosts();
}, [currentPage, pageSize, query, categoryId, sortBy, status, authorId]);

  // Chỉ thay đổi currentPage khi người dùng bấm vào Pagination
  const handlePageSizeChange = (current, newSize) => {
    setCurrentPage(1); // Reset về trang 1 khi đổi size
    setTotalPosts(0); // Reset để đồng bộ hiển thị nếu cần
    setPosts([]); // Xóa danh sách cũ (giúp tránh nháy giao diện)
    setTotalElements(0); // Reset đếm tổng
    setTotalPages(0);
    setLoading(true); // Hiện đang tải

    setTimeout(() => {
      setLoading(false); // Tắt "đang tải" sau fetch mới
    }, 300); // Nếu bạn muốn mượt hơn

    // Thay đổi kích thước trang
    setSize(newSize);
};

useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrUser(JSON.parse(storedUser)); // Parse JSON để dùng
    }
  },[]);
  
  const handlePageChange = (page) => {
    console.log("Chuyển sang trang:", page);
    setCurrentPage(page);
  };

  const handleDeleteSuccess = () => {
    // Gọi lại fetchPosts
    fetchPosts();
  };
  {posts == null && <p>Không có bài viết nào.</p>}
  return (
    <>
      {loading ? <p>Đang tải...</p> : posts.map((post) => 
      <PostListItem 
        key={post.id}
        post={post} 
        currentUser={currUser}
        onDeleteSuccess={handleDeleteSuccess}
      />)
      }
      {posts.length === 0 && <p>Không có bài viết nào =((</p>}

      {/* Pagination */}
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
    </>
  );
};

export default PostList;
