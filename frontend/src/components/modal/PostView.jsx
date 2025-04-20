import React from "react";

const PostView = ({ isOpen, onClose, post }) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* Outer container để bo góc + đổ bóng */}
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] shadow-lg relative overflow-hidden">
        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto max-h-[90vh] rounded-xl">
          {/* Nút đóng */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-600 hover:text-black text-2xl font-bold z-10"
          >
            &times;
          </button>

          {/* Tiêu đề */}
          <h1 className="text-2xl font-semibold mb-4 text-center">{post.title}</h1>

          {/* Ảnh thumbnail */}
          {post.thumbnailUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={post.thumbnailUrl}
                alt="Post Thumbnail"
                className="rounded-xl max-w-full max-h-[400px] object-contain"
              />
            </div>
          )}

          {/* Nội dung */}
          <div className="prose prose-lg max-w-none text-justify">
            <div
              dangerouslySetInnerHTML={{
                __html: post.content.replace(/<\/pre>\n<pre><code>/g, "</code></pre>\n<pre><code>"),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostView;
