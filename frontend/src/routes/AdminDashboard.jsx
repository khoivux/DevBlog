import { useState } from "react";

import Pagination from "../components/PaginationComponent";
import AdminSidebar from "../components/admin/AdminSidebar.jsx";
import PostManagement from "../components/admin/PostManagement.jsx";
import UserManagement from "../components/admin/UserManagement.jsx";
import ReportCommentManagement from "../components/admin/ReportCommentManagement.jsx";
import CategoryManagement from "../components/admin/CategoryManagement.jsx";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [postStatus, setPostStatus] = useState(null);
  const [commentStatus, setCommentStatus] = useState(null);


  return (
    <div className="flex min-h-screen items-start">

      {/* Sidebar mới */}
      <div className="">
        <AdminSidebar setActiveTab={setActiveTab} setPostStatus={setPostStatus} setCommentStatus={setCommentStatus}/>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full min-h-[650px]">
          {activeTab === "reportPost" && postStatus && <PostManagement status={postStatus} />}
          {activeTab === "reportComment" && commentStatus && <ReportCommentManagement status={commentStatus} />}
          {activeTab === "posts" && <PostManagement status={postStatus} />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "categories" && <CategoryManagement />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
