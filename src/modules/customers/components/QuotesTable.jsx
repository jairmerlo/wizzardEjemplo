import { DeleteTwoTone, EditTwoTone, EyeTwoTone } from '@ant-design/icons'
import { Space, Table, Tag, Tooltip } from 'antd'
import { getColumnProps, showTotal } from '../../../helpers'
import { getStatusColor } from '../helpers'

export const QuotesTable = ({ dataSource }) => {
  const columns = [
    {
      title: 'Quote ID',
      dataIndex: 'quote_id',
      key: 'quote_id',
    },
    {
      ...getColumnProps({
        title: 'Program',
        dataIndex: '',
      }),
    },
    {
      ...getColumnProps({
        title: 'Product/Service',
        dataIndex: '',
      }),
    },
    {
      //TODO: Formatear fecha
      ...getColumnProps({ title: 'Created Date', dataIndex: 'create_at' }),
    },
    {
      ...getColumnProps({ title: 'Price', dataIndex: '' }),
    },
    {
      ...getColumnProps({
        title: 'Expired Date',
        dataIndex: 'expiration_date',
      }),
    },
    // {
    //   title: 'Amount',
    //   dataIndex: 'amount',
    //   key: 'amount',
    //   //   render: monthlyAmount =>
    //   //     currency(monthlyAmount, {
    //   //       decimal: '.',
    //   //       separator: ',',
    //   //       precision: 0,
    //   //     }).format(),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      ...getColumnProps({ title: 'Sales Agent', dataIndex: '' }),
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
          <Tooltip title='Edit' overlayStyle={{ zIndex: 10000 }}>
            <a>
              <EditTwoTone style={{ fontSize: '18px' }} />
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
