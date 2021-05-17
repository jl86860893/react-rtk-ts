import React, { useEffect, useRef } from 'react';
import { Button, Row, Col } from 'antd'
import styles from './index.module.less'
import SearchForm from '@/components/SearchForm'
import CustomTable from '@/components/CustomTable'
import { searchFormItemsConfig } from './config'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
];



function Home() {
  const ref = useRef();

  useEffect(() => {
    // 获取下拉菜单项
    // getDefaultOptions()
    // @ts-ignore
    console.log(ref.current.getValues())
  }, [])

  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }

  const queryDatas = (params: any) => {
    
  }

  const getvalues = () => {
    // @ts-ignore
    console.log(ref.current.getValues())
  }

  return (
    <div className={styles.homeWrapper}>
      <SearchForm
        formItems={searchFormItemsConfig}
        ref={ref}
      />
      <Row style={{ flexDirection: 'row-reverse' }}>
        <Button type="primary" onClick={queryDatas}>查询</Button>
      </Row>
      <CustomTable
        withRowSelection={false}
        dataSource={data}
        columns={columns}
      />
    </div>
  )
}

export default Home;