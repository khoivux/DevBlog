import PostListItem from "../components/PostListItem";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { getPosts, getPostsByAuthorId } from "../service/postService.js";

const PostList = ({
  page = 1,
  size = 5,
  query = null,
  categoryId = null,
  sortBy = "newest",
  status = "APPROVED",
  authorId = null,
  setTotalPosts,
}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let response;
        if (authorId) {
          response = await getPostsByAuthorId(sortBy, authorId);
        } else {
          response = await getPosts(currentPage, size, query, categoryId, sortBy, status);
        }

        console.log("API Response:", response.data); // Debug log

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
    fetchPosts();
  }, [currentPage, size, query, categoryId, sortBy, status, authorId]);

  // Chỉ thay đổi currentPage khi người dùng bấm vào Pagination
  const handlePageChange = (page) => {
    console.log("Chuyển sang trang:", page);
    setCurrentPage(page);
  };

  return (
    <>
      {loading ? <p>Đang tải...</p> : posts.map((post) => <PostListItem key={post.id} post={post} />)}

      {/* Pagination */}
      {totalElements > 0 && (
        <div className="flex justify-center">
          <Pagination
            current={currentPage}
            total={totalElements}
            pageSize={size}
            onChange={handlePageChange}
            showSizeChanger={false} // Ẩn tùy chọn thay đổi số item/trang
          />
        </div>
      )}
    </>
  );
};

export default PostList;
