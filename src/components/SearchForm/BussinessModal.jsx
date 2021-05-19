import { useState } from 'react';
import { Modal } from 'antd';
import CustomTable from '@/components/CustomTable'


function BussinessModal(props) {
  const { isModalVisible, setIsModalVisible, setFieldValue } = props;

  const handleBussinessCancel = () => {
    setIsModalVisible(false)
  }

  const handleOk = (value) => {
    setFieldValue(value)
  }

  return (
    <Modal title="查找企业号" visible={isModalVisible} onOk={handleOk} onCancel={handleBussinessCancel}>
      <CustomTable ></CustomTable>
    </Modal>
  )
}

export default BussinessModal;