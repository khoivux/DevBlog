import React from 'react';
import { Pagination } from 'antd';

export default function PaginationComponent() {
  return (
    <div style={{ display: 'block', width: 700, padding: 30 }}>
        <Pagination defaultCurrent={1} total={100} showSizeChanger={false}/>
    </div>
  );
}
