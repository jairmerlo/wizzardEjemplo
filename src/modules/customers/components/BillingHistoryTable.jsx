import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import { Space, Table, Tag, Tooltip } from 'antd'
import { getColumnProps, showTotal } from '../../../helpers'
import { getStatusColor } from '../helpers'

export const BillingHistoryTable = ({ dataSource }) => {
  const columns = [
    {
      title: 'Membership ID',
      dataIndex: 'membership_id',
      key: 'membership_id',
    },
    {
      title: 'URL',
      dataIndex: 'wordpress_install_url',
      key: 'wordpress_install_url',
      render: url => (
        <a href={url} target='_blank' rel='noreferrer'>
          {url}
        </a>
      ),
      ellipsis: true,
    },
    {
      ...getColumnProps({
        title: 'Invoice #',
        dataIndex: 'name',
      }),
    },
    {
      ...getColumnProps({ title: 'Date', dataIndex: 'created_at' }),
    },
    {
      title: '$ Lifetime',
      dataIndex: 'total',
      key: 'total',
      //   render: monthlyAmount =>
      //     currency(monthlyAmount, {
      //       decimal: '.',
      //       separator: ',',
      //       precision: 0,
      //     }).format(),
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
      dataSource={dataSource}
      bordered
      pagination={{
        showTotal,
      }}
    />
  )
}
