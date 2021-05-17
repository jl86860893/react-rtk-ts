import React, { useState } from 'react';
import { Table } from 'antd';

function CustomTable(props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const { dataSource, columns, withRowSelection } = props;

  const onSelectChange = selectedRowKeys => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      rowSelection={withRowSelection ? rowSelection: null}
      columns={columns}
      dataSource={dataSource}
    />
  )
}

export default CustomTable;