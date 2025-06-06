import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import ConfirmModal from "../modal/ConfirmModal";
const ReportManagement = () => {
  

  const handleResolve = (id) => {
    setReports(reports.map(report => report.id === id ? { ...report, status: "Đã xử lý" } : report));
  };

  return (
    <div>
      <h2>Quản lý báo cáo vi phạm</h2>
      <Table striped bordered>
        <thead>
          <tr>
            <th>ID</th>
            <th>Loại</th>
            <th>Nội dung</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.type}</td>
              <td>{report.content}</td>
              <td>{report.status}</td>
              <td>
                {report.status === "Chờ xử lý" && (
                  <Button variant="success" onClick={() => handleResolve(report.id)}>Xử lý</Button>
                )}
                <Button variant="danger" className="ms-2">Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReportManagement;
