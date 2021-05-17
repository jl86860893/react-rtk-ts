import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function GenerateInput(props: any) {

  useEffect(() => {

  }, [])

  const {
    type,
    label,
    name,
    required,
    labelAlign,
    initialValue,
    options,
    comProps,
    ...otherProps
  } = props;

  let result;
  if (type === 'Input') {
    result = (
      <Form.Item
        label={label}
        name={name}
        required={required}
        labelAlign={labelAlign}
        initialValue={initialValue}
        {...otherProps}
      >
        <Input {...comProps} />
      </Form.Item>
    )
  }

  if (type === 'Select') {
    let optionDom;
    if (options && options.length) {
      optionDom = options.map((item: { title: string; value: string; }) => {
        const { title, value } = item;
        return <Option key={title} title={title} value={value}>{title}</Option>
      })
    }
    result = (
      <Form.Item
        label={label}
        name={name}
        required={required}
        labelAlign={labelAlign}
        initialValue={initialValue}
        {...otherProps}
      >
        <Select {...comProps} style={{ width: 120 }}>
          {optionDom}
        </Select>
      </Form.Item>
    )
  }

  if (type === 'RangePicker') {
    result = (
      <Form.Item
        label={label}
        name={name}
        required={required}
        labelAlign={labelAlign}
        initialValue={initialValue}
        {...otherProps}
      >
        <RangePicker
          {...comProps}
        />
      </Form.Item>
    )
  }

  return result;
}