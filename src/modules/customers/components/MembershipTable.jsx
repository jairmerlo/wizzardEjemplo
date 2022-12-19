import { Table, Tag } from 'antd'
import { getColumnProps, showTotal } from '../../../helpers'
import { getStatusColor } from '../helpers'

export const MembershipTable = ({ memberships }) => {
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
    },
    {
      ...getColumnProps({ title: 'Product/Service', dataIndex: 'product' }),
    },
    {
      title: 'Created Date',
      key: 'created_date',
      dataIndex: 'created_date',
      //   render: date => moment(moment(date, 'MM-DD-YYYY')).format('ll'),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      //   render: monthlyAmount =>
      //     currency(monthlyAmount, {
      //       decimal: '.',
      //       separator: ',',
      //       precision: 0,
      //     }).format(),
    },
    {
      ...getColumnProps({ title: 'Periods', dataIndex: 'periods' }),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      //   render: monthlyAmount =>
      //     currency(monthlyAmount, {
      //       decimal: '.',
      //       separator: ',',
      //       precision: 0,
      //     }).format(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
  ]
  return (
    <Table
      rowKey='id'
      size='small'
      columns={columns}
      dataSource={memberships}
      bordered
      pagination={{
        showTotal,
      }}
    />
  )
}
