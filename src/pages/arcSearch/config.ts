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
  asyncOption?: boolean
}

interface ITableColumns {
  key: string,
  title: string,
  dataIndex: string,
  render?: Function,
}

const searchFormItemsConfig: ISearchFormConfig[] = [
  {
    type: 'Input',
    name: 'enterpriseName',
    label: React.createElement('span', null, '企业名称'),
    required: true,
    labelAlign: 'right',
    comProps: {
    }
  },
  {
    type: 'Select',
    name: 'enterpriseFrom',
    label: React.createElement('span', null, '企业来源'),
    labelAlign: 'right',
    options: [
      {
        title: 'CBS',
        value: 'C',
      },
      {
        title: 'TMS',
        value: 'T',
      },
      {
        title: 'CSC',
        value: 'XXX',
      },
      {
        title: 'TEX',
        value: 'XXX',
      },
      {
        title: 'CBCC',
        value: 'XXX',
      },
    ],
    comProps: {
      
    }
  },
  {
    type: 'Select',
    name: 'cmbuIp',
    label: React.createElement('span', null, 'CMBU服务器'),
    labelAlign: 'right',
    asyncOption: true,
    comProps: {
      
    }
  },
  // {
  //   type: 'RangePicker',
  //   name: 'testRP',
  //   label: React.createElement('span', null, 'picker0'),
  //   labelAlign: 'right',
  //   comProps: {
  //     format: "YYYY/MM/DD"
  //   }
  // },
  // {
  //   type: 'RemoteSearch',
  //   name: 'testRSer',
  //   label: React.createElement('span', null, 'picker1'),
  //   labelAlign: 'right',
  //   comProps: {
  //   }
  // }
]

const statusMap: {A: string, S: string, C: string} = {
  A: '活动',
  S: '暂停使用',
  C: '关闭'
}

const fromMap: {T: string, S: string, C: string} = {
  T: 'TMS',
  S: 'SFB',
  C: 'CBS'
}

const tableColumns: ITableColumns[] = [
  {
    key: 'enterpriseStatus',
    title: '状态',
    dataIndex: 'enterpriseStatus',
    render: (text: string) => {
      // @ts-ignore
      return statusMap[text]
    }
  },
  {
    key: 'enterpriseNo',
    title: '企业号',
    dataIndex: 'enterpriseNo'
  },
  {
    key: 'enterpriseName',
    title: '企业名称',
    dataIndex: 'enterpriseName'
  },
  {
    key: 'enterpriseFrom',
    title: '企业来源',
    dataIndex: 'enterpriseFrom',
    // @ts-ignore
    render: (text: string) => fromMap[text]
  },
  {
    key: 'enterpriseBankname',
    title: '所属分行',
    dataIndex: 'enterpriseBankname'
  },
  {
    key: 'enterpriseLink',
    title: '联系人',
    dataIndex: 'enterpriseLink'
  },
  {
    key: 'createTime',
    title: '开通日期',
    dataIndex: 'createTime'
  },
  {
    key: 'notifyIp',
    title: '业务通知接收IP/域名',
    dataIndex: 'notifyIp'
  },
  {
    key: 'notifyPort',
    title: '业务通知接收端口',
    dataIndex: 'notifyPort'
  },
  {
    key: 'enterpriseStatus',
    title: '业务通知接收上下文',
    dataIndex: 'enterpriseStatus'
  },
  {
    key: 'connectProtocol',
    title: '业务系统对接方式',
    dataIndex: 'connectProtocol'
  },
  {
    key: 'updateTime',
    title: '维护日期',
    dataIndex: 'updateTime'
  },
  {
    key: 'managerUser',
    title: '维护用户',
    dataIndex: 'managerUser'
  },
  {
    key: 'connectAs400',
    title: '开通招行AS400',
    dataIndex: 'connectAs400'
  },
  {
    key: 'cmbuNumber',
    title: '主机企业编号',
    dataIndex: 'cmbuNumber'
  },
  {
    key: 'cmbuIp',
    title: 'CMBU服务器IP',
    dataIndex: 'cmbuIp'
  },
]

export { searchFormItemsConfig, tableColumns };