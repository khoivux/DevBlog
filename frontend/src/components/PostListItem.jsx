import { Link } from "react-router-dom";

const PostListItem = ({ post }) => {
  return (
    <div className="flex flex-col xl:flex-row gap-8 mb-4 shadow-custom rounded-[40px] p-3 bg-white">
        {/* image */}
        <div className="md:hidden xl:block xl:w-1/2">
            <img src={post.thumbnailUrl} className="rounded-[40px] object-cover" width="735 border-2 border-gray-200" />
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
            <Link to={`/post/${post.id}`} className='text-white small-text lg:small-text rounded-3xl p-3 py-2 bg-[#0EE719] hover:scale-105'>Đọc thêm</Link>
            </div>
        </div>
    </div>

  );
};

export default PostListItem