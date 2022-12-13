import React from 'react'
import { Space, Table, Tag, Tooltip } from 'antd'
import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import jsonData from './data.json'
import { getStatusColor } from './helpers'

const columns = [
  {
    title: 'Customer ID',
    dataIndex: 'customerId',
    key: 'customerId',
  },
  {
    title: 'Client Name',
    dataIndex: 'clientName',
    key: 'clientName',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone',
    key: 'phone',
    dataIndex: 'phone',
  },
  {
    title: 'Membership',
    dataIndex: 'membership',
    key: 'membership',
  },
  {
    title: 'Monthly Amount',
    dataIndex: 'monthlyAmount',
    key: 'monthlyAmount',
    render: monthlyAmount => `$${monthlyAmount}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag color={getStatusColor(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    ),
  },
  {
    title: 'Since',
    dataIndex: 'since',
    key: 'since',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
    key: 'actions',
    render: () => (
      <Space size='middle'>
        <Tooltip title='Details'>
          <a>
            <EyeTwoTone />
          </a>
        </Tooltip>
        <Tooltip title='Edit'>
          <a>
            <EditTwoTone />
          </a>
        </Tooltip>
        <Tooltip title='Delete'>
          <a>
            <DeleteTwoTone />
          </a>
        </Tooltip>
      </Space>
    ),
  },
]

const data = [
  {
    key: '1',
    customerId: 1,
    clientName: 'John Brown',
    phone: '+51 934 643 232',
    email: 'john.brown@gmail.com',
    membership: 32,
    since: '12/13/2022',
    monthlyAmount: 10000,
    status: 'active',
  },
  {
    key: '2',
    customerId: 2,
    clientName: 'Jim Green',
    phone: '+51 934 643 232',
    email: 'jim.green@gmail.com',
    membership: 42,
    since: '12/13/2022',
    monthlyAmount: 20000,
    status: 'pending',
  },
  {
    key: '3',
    customerId: 3,
    clientName: 'Joe Black',
    email: 'joe.black@gmail.com',
    phone: '+51 934 643 232',
    membership: 32,
    since: '12/13/2022',
    monthlyAmount: 30000,
    status: 'unactive',
  },
]

const Customers = () => <Table columns={columns} dataSource={data} />

export default Customers
