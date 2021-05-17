import React, { ReactNode } from "react"

interface ISearchFormConfig {
  type: string,
  name: string,
  label: ReactNode,
  required?: boolean,
  labelAlign: string,
  initialValue?: number | string,
  options?: Object[],
  comProps: Object,
}

const searchFormItemsConfig: ISearchFormConfig[] = [
  {
    type: 'Input',
    name: 'testIp',
    label: React.createElement('span', null, '1234'),
    required: true,
    labelAlign: 'left',
    comProps: {
      
    }
  },
  {
    type: 'Select',
    name: 'testSe',
    label: React.createElement('span', null, '虽然'),
    labelAlign: 'left',
    options: [
      {
        title: 'aaa',
        value: 'aaa',
      }
    ],
    comProps: {
      
    }
  },
  {
    type: 'RangePicker',
    name: 'testRP',
    label: React.createElement('span', null, 'picker0'),
    labelAlign: 'left',
    comProps: {
      format: "YYYY/MM/DD"
    }
  },
  {
    type: 'RangePicker',
    name: 'testRP1',
    label: React.createElement('span', null, 'picker1'),
    labelAlign: 'left',
    comProps: {
      format: "YYYY/MM/DD"
    }
  }
]

export { searchFormItemsConfig };