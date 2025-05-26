import { Tooltip } from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useToast } from "../../contexts/ToastContext";
import { EyeIcon, TrashIcon, CheckIcon} from "@heroicons/react/24/solid";
import ConfirmModal from "../modal/ConfirmModal";
import { getReportComment, handleReportComment } from "../../service/reportService";
import CustomPagination from "../CustomPagination";
import { deleteComment } from "../../service/commentService";

const ReportCommentManagement = ({ status }) => {
  const [sortBy, setSortBy] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {showToast} = useToast();
  const [pageSize, setPageSize] = useState(8);
  const [selectedItem, setselectedItem] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [reportComments, setReportComments] = useState([]);
  const [confirmType, setConfirmType] = useState(null); 
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);

   const openConfirmModal = (report, type) => {
    setselectedItem(report);
    setConfirmType(type); // "approve" hoặc "reject"
    setIsConfirmModalOpen(true);
  };
  const openDeleteConfirmModal = (report) => {
    setselectedItem(report);
    setIsConfirmDeleteModalOpen(true);
  };
  const handleDelete = async () => {
       try {
        const response = await deleteComment(selectedItem.comment.id);
        showToast("success", response.message);
        fetchReports();
      } catch (err) {
        setError(err.message);
      }
    };
  const fetchReports = async () => {
    try {
      const res = await getReportComment(currentPage, pageSize, sortBy)
      setReportComments(res.data.data);
      setTotalElements(res.data.totalElements);
    } catch (error) {
      showToast('error', error.message);
    }
  }
  
   useEffect(() => {
    fetchReports();
  }, [currentPage, pageSize, sortBy]);;

    const closeConfirmModal = () => {
    setselectedItem(null);
    setConfirmType(null);
    setIsConfirmModalOpen(false);
    setIsConfirmDeleteModalOpen(false);
  };

   const handleConfirm = async () => {
      try {
        const response = await handleReportComment(selectedItem.id, confirmType);
        showToast("success", response.message);
        fetchReports();
      } catch (error) {
        showToast("error", error.message);
      } finally {
        closeConfirmModal();
      }
    };
  
 
  
  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-center mb-4">Báo cáo bình luận</h2>
      <div className="flex justify-center px-4">
        <table className="border-collapse border border-gray-300 text-sm w-full max-w-[95%]">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Mã báo cáo</th>
              <th className="border p-2">Nội dung bình luận</th>
              <th className="border p-2">Mô tả vi phạm</th>
              <th className="border p-2">Người báo cáo</th>
              <th className="border p-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {reportComments.map((report) => (
              <tr key={report.id} className="text-center border">
                <td className="border p-2">{report.id}</td>
                <td className="border p-2 max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">{report.comment.content}</td>
                <td className="border p-2">{report.reason}</td>
                <td className="border p-2">{report.authorName}</td>
                <td className="border p-2 max-w-[220px] overflow-hidden text-ellipsis whitespace-nowrap flex justify-center space-x-2">
                    <Tooltip content="Xem bài">
                      <a
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="bg-blue-500 text-white p-2 rounded inline-flex items-center"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                    </Tooltip>
                    <Tooltip content="Xóa bình luận">
                  <button
                    onClick={() => openDeleteConfirmModal(report)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
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
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Xác nhận xóa */}
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
      <ConfirmModal
              isOpen={isConfirmModalOpen}
              onClose={closeConfirmModal}
              onConfirm={handleConfirm}
              title={"Xác nhận"}
              message={
                confirmType === "approved"
                  ? "Xác nhận hoàn tất xử lý báo cáo?"
                  : "Xác nhận bỏ qua báo cáo?"
              }
            />
      <ConfirmModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={closeConfirmModal}
        onConfirm={handleDelete}
        title={"Xác nhận"}
        message={"Xác nhận xóa bình luận"}
      />
    </div>
  );
};

export default ReportCommentManagement;
