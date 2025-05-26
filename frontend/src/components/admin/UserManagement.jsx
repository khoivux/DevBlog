import { Tooltip } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { Pagination } from "antd";
import { KeyIcon, LockOpenIcon, BellIcon, LockClosedIcon, MinusCircleIcon } from "@heroicons/react/24/solid";
import ConfirmModal from "../modal/ConfirmModal";
import { getList } from "../../service/userService";
import { blockUser, setRole } from "../../service/adminService";
import CustomPagination from "../CustomPagination";

const UserManagement = () => {
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortByCount, setSortByCount] = useState("asc");

  const formatDateToISO = (dateStr) => {
    if (!dateStr) return null;
    // dateStr là "2025-05-02"
    // chuyển thành "2025-05-02T00:00:00Z"
    return dateStr + "T00:00:00Z";
  };
    const fetchUsers = async () => {
      try {
        const response = await getList(searchQuery, currentPage, pageSize, formatDateToISO(startDate), formatDateToISO(endDate), sortByCount);
        setUsers(response.data);
        setTotalElements(response.totalElements);
      } catch (error) {
        showToast("error", error.message);
      }
    };

  const openRoleModal = (user) => {
    setSelectedUser(user);
    setIsRoleModalOpen(true);
  };

  const closeRoleModal = () => {
    setSelectedUser(null);
    setIsRoleModalOpen(false);
  };
  
  const openLockModal = (user) => {
    setSelectedUser(user);
    setIsLockModalOpen(true);
  };

  const closeLockModal = () => {
    setSelectedUser(null);
    setIsLockModalOpen(false);
  };

  const handleLock = async () => {
    try {
      const response = await blockUser(selectedUser);
      fetchUsers(); // Refresh lại danh sách
      showToast("success", response.message);
      setSelectedUser(null);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      closeLockModal();
    }
  };
  
  const handleRoleChange = async () => {
    try {
      const newRole = selectedUser.roles.includes("MOD") ? "UNMOD" : "MOD";
      const response = await setRole({ username: selectedUser.username, role: newRole });
      setSelectedUser(null);
      fetchUsers();
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      closeRoleModal();
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, [searchQuery, currentPage, pageSize, startDate, endDate, sortByCount]);
    

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4">Quản lý người dùng</h2>
     <div className="ml-10 mb-4 space-y-3">
  {/* Dòng 1: Input tìm kiếm full width */}
  <div>
    <input
      type="text"
      placeholder="Nhập tên hiển thị, email"
      className="border px-3 py-2 rounded w-full max-w-lg text-sm"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>

  {/* Dòng 2: Label phía trên các input lọc */}
  <div>
    <span className="text-base font-semibold">Lọc theo bài viết</span>
  </div>

  {/* Dòng 3: 2 ô ngày và 1 select cạnh nhau */}
  <div className="flex space-x-4 max-w-lg">
    <input
      type="date"
      className="border px-3 py-2 rounded text-sm flex-1"
      value={startDate}
      onChange={(e) => setStartDate(e.target.value)}
      placeholder="Ngày bắt đầu"
    />
    <input
      type="date"
      className="border px-3 py-2 rounded text-sm flex-1"
      value={endDate}
      onChange={(e) => setEndDate(e.target.value)}
      placeholder="Ngày kết thúc"
    />
    <select
      className="border px-3 py-2 rounded text-sm w-40"
      value={sortByCount}
      onChange={(e) => setSortByCount(e.target.value)}
    >
      <option value="asc">Số bài tăng dần</option>
      <option value="desc">Số bài giảm dần</option>
    </select>
  </div>
</div>


      <div className="flex justify-center px-4">
        <table className="border-collapse border border-gray-300 text-sm w-full max-w-[95%]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border">Mã người dùng</th>
              <th className="border">Tên</th>
              <th className="border">Username</th>
              <th className="border">Email</th>
              <th className="border">Số bài viết</th>
              <th className="border">Quyền hạn</th>
              <th className="border">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {!users || users.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id} className="text-center border">
                  <td className="border px-1 py-1">{user.id}</td>
                  <td className="border px-1 py-1 break-words whitespace-normal">
                    <a
                      href={`/author/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-black hover:text-red-500 hover:font-bold transition duration-200"
                    >
                      {user.displayName}
                    </a>
                  </td>
                  <td className="border px-1 py-1 break-words whitespace-normal">
                    <a
                      href={`/author/${user.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer text-black hover:text-red-500 hover:font-bold transition duration-200"
                    >
                      {user.username}
                    </a>
                  </td>

                  <td className="border px-1 py-1 break-words whitespace-normal">{user.email}</td>
                  <td className="border px-1 py-1">{user.countPost ?? 0}</td> {/* Hiển thị số bài viết */}
                  <td className="border px-1 py-1 break-words whitespace-normal">{[...user.roles].join(', ')}</td>
                  
                  <td className="border px-1 py-1 space-x-1">
                    {!user.isBlocked ? (
                      <>
                        <Tooltip content={user.roles.includes("MOD") ? "Gỡ quyền kiểm duyệt viên" : "Cấp quyền kiểm duyệt viên"}>
                          <a
                            onClick={() => openRoleModal(user)}
                            className="bg-green-500 text-white p-2 rounded inline-flex items-center"
                          >
                            {user.roles.includes("MOD") ? (
                              <MinusCircleIcon className="h-4 w-4" />  
                            ) : (
                              <KeyIcon className="h-4 w-4" /> 
                            )}
                          </a>
                        </Tooltip>

                        <Tooltip content="Khóa tài khoản">
                          <a
                            className="bg-red-500 text-white p-2 rounded inline-flex items-center cursor-pointer"
                          >
                            <LockClosedIcon 
                              className="h-4 w-4"
                              onClick={() => openLockModal(user)} 
                            />

                          </a>
                        </Tooltip>
                      </>
                    ) : (
                      <Tooltip content="Gỡ khóa tài khoản">
                        <a
                          className="bg-blue-500 text-white p-2 rounded inline-flex items-center cursor-pointer"
                        >
                          <LockOpenIcon 
                            className="h-4 w-4" 
                            onClick={() => openLockModal(user)} 
                          />
                        </a>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              ))
            )}
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
        </div>)}
      {/* Modal Xác nhận xóa */}
      <ConfirmModal
        isOpen={isLockModalOpen}
        onClose={closeLockModal}
        onConfirm={handleLock}
        title={selectedUser?.isBlocked ? "Gỡ khóa tài khoản" : "Khóa tài khoản"}
        message={`Bạn có chắc chắn muốn ${selectedUser?.isBlocked ? "gỡ khóa" : "khóa"} tài khoản người dùng không?`}
        type="user"
      />

      <ConfirmModal
        isOpen={isRoleModalOpen}
        onClose={closeRoleModal}
        onConfirm={handleRoleChange}
        title={selectedUser?.roles.includes("MOD") ? "Gỡ quyền" : "Cấp quyền"}
        message={`Bạn muốn ${selectedUser?.roles.includes("MOD") ? "gỡ quyền" : "cấp quyền"} kiểm duyệt viên cho ${selectedUser?.displayName}?`}
        type="role"
      />

    </div>
  );
}
export default UserManagement;