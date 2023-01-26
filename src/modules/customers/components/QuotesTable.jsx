import { EyeTwoTone, EditTwoTone } from '@ant-design/icons'
import { Space, Table, Tag, Tooltip } from 'antd'
import { getColumnProps, showTotal, USD } from '../../../helpers'
import { getStatusColor } from '../helpers'

export const QuotesTable = ({ dataSource }) => {
  const columns = [
    {
      title: 'Quote ID',
      dataIndex: 'quote_name',
      key: 'quote_name',
    },
    {
      ...getColumnProps({
        title: 'Program',
        dataIndex: 'name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Product/Service',
        dataIndex: 'accounting_class_name',
      }),
    },
    {
      ...getColumnProps({ title: 'Created Date', dataIndex: 'created_on' }),
    },
    {
      ...getColumnProps({ title: 'Price', dataIndex: 'total_amount' }),
      render: (text, r) =>
        '$' + parseFloat(r.total_amount) + parseFloat(r.total_setup),
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
      ...getColumnProps({ title: 'Sales Agent', dataIndex: 'user_name' }),
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
