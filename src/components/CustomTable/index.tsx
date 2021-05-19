// @ts-nocheck
import React, { useState } from 'react';
import { Table } from 'antd';
import TableTitle from './TableTitle'

/**
 * 
 * @param {dataSource} props dataSource
 * @param {columns} props columns
 * @param {withRowSelection?} props withRowSelection可选
 * @param {titleName?} props titleName
 * @param {titleTips?} props titleTips
 * @param {titleAction?} props titleAction
 * @returns ReactTable
 */

function CustomTable(props: any) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const {
    dataSource,
    columns,
    withRowSelection,
    titleName,
    titleTips,
    titleAction
  } = props;

  const onSelectChange = (selectedRowKeys: React.SetStateAction<never[]>) => {
    setSelectedRowKeys(selectedRowKeys)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <>
      <TableTitle
        titleName={titleName}
        titleTips={titleTips}
        titleAction={titleAction}
      />
      <Table
        rowSelection={withRowSelection ? rowSelection: undefined}
        columns={columns}
        dataSource={dataSource}
      />
    </>
  )
}

export default CustomTable;