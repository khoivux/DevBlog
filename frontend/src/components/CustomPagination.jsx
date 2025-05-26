import { Pagination, Select } from "antd";
import { useState } from "react";

const CustomPagination = ({
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalElements,
}) => {
    const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex justify-center items-center gap-4 mt-4">
      <Pagination
        current={currentPage}
        total={totalElements}
        pageSize={pageSize}
         onChange={handlePageChange} 
        showSizeChanger={false} // Tắt mặc định
        showTotal={(total, range) => `${range[0]}-${range[1]} trong ${total}`}
      />

      <div className="flex items-center gap-2">
        <span>Số hàng/trang:</span>
        <Select
          showSearch
          value={String(pageSize)}
          style={{ width: 100 }}
          placeholder="Số hàng"
          onChange={(value) => {
            const numberValue = parseInt(value);
            if (!isNaN(numberValue) && numberValue > 0) {
              setPageSize(numberValue);
              setCurrentPage(1);
            }
          }}
          onInputKeyDown={(e) => {
            if (e.key === "Enter") {
              const value = parseInt(e.target.value);
              if (!isNaN(value) && value > 0) {
                setPageSize(value);
                setCurrentPage(1);
              }
            }
          }}
          options={[
            { label: "5", value: "5" },
            { label: "10", value: "10" },
            { label: "15", value: "15" },
            { label: "20", value: "20" },
            { label: "50", value: "50" },
          ]}
        />
      </div>
    </div>
  );
};

export default CustomPagination;
