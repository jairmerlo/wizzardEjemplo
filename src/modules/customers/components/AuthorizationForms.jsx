import {
  CopyOutlined,
  EyeTwoTone,
  RetweetOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Space, Table, Tooltip } from 'antd'
import { getColumnProps, showTotal } from '../../../helpers'

const data = [
  {
    name: 'ACH',
    status: 'Waiting for Client',
  },
  {
    name: 'Credit Card',
    status: 'Completed',
  },
]

export const AuthorizationForms = ({ dataSource }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { id }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
            <a>
              <EyeTwoTone style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          <Tooltip title='Send' overlayStyle={{ zIndex: 10000 }}>
            <a>
              <SendOutlined style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          <Tooltip title='Re-Send' overlayStyle={{ zIndex: 10000 }}>
            <a>
              <RetweetOutlined style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          <Tooltip title='Replace' overlayStyle={{ zIndex: 10000 }}>
            <a>
              <CopyOutlined style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          {/* eslint-enable jsx-a11y/anchor-is-valid */}
        </Space>
      ),
    },
  ]
  return (
    <Table
      rowKey='id'
      size='small'
      columns={columns}
      dataSource={data}
      bordered
      pagination={{
        showTotal,
      }}
    />
  )
}
