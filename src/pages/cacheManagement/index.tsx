import CustomTable from '@/components/CustomTable';
import React, { useEffect, useState } from 'react'
import { Space, Button } from 'antd'
import responseCode from '@/utils/responseCode'
import { querySysParam, requestForDeleteCache } from '@/services/cacheService'

const tableColumns = [
  {
    title: '缓存代码',
    dataIndex: 'paramExt',
    key: 'paramExt',
  },
  {
    title: '缓存名称',
    dataIndex: 'paramName',
    key: 'paramName',
  },
  {
    title: '参数',
    key: 'options',
    fixed: 'right',
    render: (_: any, record: { paramExt: any; }) => (
      <Space size="middle">
        <Button type="primary" onClick={() => requestForDeleteCache(record.paramExt)}>清理</Button>
      </Space>
    ),
  },
]

function CacheManageMent() {
  const [tableDataSource, setTableDataSource] = useState([]);

  useEffect(() => {
    prepareQuerySysParam()
  }, [])

  const prepareQuerySysParam = async() => {
    const res: any = await querySysParam({
      paramFat: 'CACHETYP',
      paramRoot: 'COMPARAM'
    });
    if (res.data.code === responseCode.success) {
      const result = res.data.data.map((item: { paramName: string, paramExt: string }) => {
        return {
          paramName: item.paramName,
          paramExt: item.paramExt
        }
      })
      setTableDataSource(result)
    }
  }

  return (
    <CustomTable dataSource={tableDataSource} columns={tableColumns}></CustomTable>
  )
}

export default CacheManageMent;