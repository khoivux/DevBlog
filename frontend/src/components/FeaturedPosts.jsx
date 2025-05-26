import { Link} from "react-router-dom"
// import Image from "./Image";
import { useState, useEffect, useRef } from "react";
import { getPosts, getPostsByAuthorId } from "../service/postService.js";
import PostListItem from "./PostListItem.jsx";
const FeaturedPosts = () => {
  const [posts, setPosts] = useState([]);
const [loading, setLoading] = useState(false);
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let response;
       response = await getPosts(1, 5, null, null, "latest", "APPROVED");
      setPosts(response.data);
     
    } catch (error) {
      console.error("Lỗi tải bài viết:", error.message);
    }
    setLoading(false);
  };
    
    useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="mt-8 flex flex-col lg:flex-row gap-4">
  {/* First Post - lớn bên trái */}
  {posts[0] && (
    <div className="w-full lg:w-1/2 flex flex-col gap-4 shadow-custom rounded-[40px] p-3 bg-white">
      <img
        src={posts[0].thumbnailUrl || "featured1.jpeg"}
        className="rounded-[40px] object-cover border-2 border-gray-200"
      />
      <div className="flex items-center gap-4 px-4">
        <Link
          to={`/search?cat=${post.category.id}`}
          className="text-white small-text rounded-[40px] p-3 py-1 bg-[#44D6FF] hover:scale-105"
        >
          {posts[0].category.name || "Chuyên mục"}
        </Link>
        <span className="text-gray-500">
          {dayjs(posts[0].createdTime).fromNow()}
        </span>
      </div>
      <Link
        to={`/post/${posts[0].id}`}
        className="px-4 pb-1 text-xl lg:text-2xl font-semibold lg:font-bold"
      >
        {posts[0].title}
      </Link>
    </div>
  )}

  {/* Các bài còn lại bên phải */}
  <div className="w-full lg:w-1/2 flex flex-col gap-4">
    {[1, 2, 3].map((index) => (
      posts[index] && (
        <div
          key={posts[index].id}
          className="h-1/3 flex justify-between gap-4 shadow-custom rounded-[40px] p-3 bg-white"
        >
          <img
            src={posts[index].thumbnailUrl || `featured${index + 1}.jpeg`}
            className="rounded-[40px] object-cover w-1/3 aspect-video border-2 border-gray-200"
          />
          <div className="w-2/3">
            <div className="flex items-center gap-4 text-sm lg:text-base mb-4">
              <Link
                to={`/search?cat=${post.category.id}`}
                className="text-white small-text rounded-[40px] p-3 py-1 bg-[#44D6FF] hover:scale-105"
              >
                {posts[index].category.name || "Chuyên mục"}
              </Link>
              <span className="text-gray-500 text-sm">
                {dayjs(posts[index].createdTime).fromNow()}
              </span>
            </div>
            <Link
              to={`/post/${posts[index].id}`}
              className="text-sm sm:text-base md:text-xl lg:text-lg xl:text-xl font-medium"
            >
              {posts[index].title}
            </Link>
          </div>
        </div>
      )
    ))}
  </div>
</div>

  )
}

export default FeaturedPosts