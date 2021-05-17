import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { Form, Input, Row, Col } from 'antd';
import GenarateInput from '@/components/GenerateInput'
import styles from './index.module.less'

/**
 * 
 * @formLayout {} param0 
 * @formItemLayout {} param1 
 * @formItems {} param1 
 */

const SearchForm = (props, ref) => {
  const {
    formLayout = "inline",
    formItems,
    ...otherProps
  } = props;

  const [form] = Form.useForm();

  useImperativeHandle(ref, () => ({
    getValues: () => {
      return form.getFieldsValue(true)
    }
  }));

  return (
    <Form
      form={form}
      layout={formLayout}
      {...otherProps}
      className={styles.antAdvancedSearchForm}
    >
      <Row gutter={24} style={{ width: '100%' }}>
        {
          formItems.map((item, index) => {
            return (
              // 缺少属性 options
              <Col span={6} key={index}>
                <GenarateInput {...item} />
              </Col>
            )
          })
        }
      </Row>
    </Form>
  )
}

export default forwardRef(SearchForm);