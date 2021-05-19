import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { Form, Input, Row, Col, Modal } from 'antd';
import GenarateInput from '@/components/GenerateInput'
import BussinessModal from './BussinessModal'

import styles from './index.module.less'

/**
 * 
 * @formLayout {} param0 
 * @formItemLayout {} param1 
 * @formItems {} param1 
 */

const SearchForm = (props, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const {
    formLayout = "inline",
    formItems,
    withBussinessInput,
    ...otherProps
  } = props;

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return form.getFieldsValue(true)
    }
  }));

  const onBussinessSearch = (value) => {
    console.log(value)
    // 请求后台模糊搜索或者缓存中读取进行过滤，弹框出现进行选择
    setIsModalVisible(true)
  }

  const setFieldValue = (value) => {
    form.setFieldsValue({bussinessCode: value})
  }

  return (
    <Form
      form={form}
      labelCol={{span: 12}}
      wrapperCol={{span: 18}}
      layout={formLayout}
      {...otherProps}
      className={styles.antAdvancedSearchForm}
    >
      <Row gutter={24} style={{ width: '100%' }}>
        {
          // 查询企业号使用较广，在业务代码中通过withBussinessInput判断添加
          withBussinessInput ?
            <Col span={6}>
              <Form.Item
                label="企业号"
                name="enterpriseNo"
                required
                labelAlign="right"
              >
                <Input.Search onSearch={onBussinessSearch} style={{ width: '100%' }} value={123455} />
              </Form.Item>
            </Col>
          : null
        }
        {
          formItems.map((item, index) => {
            return (
              // 缺少属性 options
              <Col span={6} key={index}>
                <GenarateInput {...item} style={{ width: '100%' }} />
              </Col>
            )
          })
        }
      </Row>
      <BussinessModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setFieldValue={setFieldValue}
      >
      </BussinessModal>
    </Form>
  )
}

export default forwardRef(SearchForm);