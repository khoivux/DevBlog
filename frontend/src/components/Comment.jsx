import { Link } from "react-router-dom";
const Comment = () => {
  return (
    <div className="p-4 bg-slate-50 rounded-xl mb-2 max-w-[780px]">
      <div className="flex items-center gap-4">
        {/* {comment.user.img && (
          <Image
            src={comment.user.img}
            className="w-10 h-10 rounded-full object-cover"
            w="40"
          />
        )} */}
        <img src="avatar.png" className="w-10 h-10 rounded-full object-cover" w="40"/>
        <Link to="/author"><span className="font-medium hover:text-red-500">Vũ Khôi</span></Link>
        <span className="text-sm text-gray-500">
          Thời gian tạo
        </span>
        {/* {user &&
          (comment.user.username === user.username || role === "admin") && (
            <span
              className="text-xs text-red-300 hover:text-red-500 cursor-pointer"
              onClick={() => mutation.mutate()}
            >
              delete
              {mutation.isPending && <span>(in progress)</span>}
            </span>
          )} */}
      </div>
      <div className="mt-4">
        <p>Bài viết rất hay, cảm ơn tác giả.</p>
      </div>
    </div>
  )
}

export default Comment