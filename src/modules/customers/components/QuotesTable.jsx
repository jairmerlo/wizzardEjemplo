import { EyeTwoTone, EditTwoTone } from '@ant-design/icons'
import { Space, Table, Tag, Tooltip } from 'antd'
import currency from 'currency.js'
import {
  getColumnProps,
  getColumnSearchProps,
  getColumnSortProps,
  getDateColumnSearchProps,
  getSelectSearchProps,
  showTotal,
  USD,
} from '../../../helpers'
import { getColumnFilterProps } from '../../../helpers/getColumnFilterProps'
import { useColumnSearch } from '../../../hooks'
import { getStatusColor } from '../helpers'

export const QuotesTable = ({ dataSource }) => {
  const { handleReset, handleSearch, searchInput, searchedColumn, searchText } =
    useColumnSearch({
      quote_name: null,
      name: null,
      accounting_class_name: null,
      created_on: null,
      total_amount: null,
    })
  const columns = [
    {
      ...getColumnProps({
        title: 'Quote ID',
        dataIndex: 'quote_name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'quote_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'quote_name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Program',
        dataIndex: 'name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Product/Service',
        dataIndex: 'accounting_class_name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'accounting_class_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'accounting_class_name',
      }),
    },
    {
      ...getColumnProps({ title: 'Created Date', dataIndex: 'created_on' }),
      ...getDateColumnSearchProps({
        dataIndex: 'created_on',
        initialFormat: 'MM-DD-YYYY',
        finalFormat: 'll',
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'created_on',
        type: 'date',
        format: 'MM-DD-YYYY',
      }),
    },
    {
      ...getColumnProps({ title: 'Price', dataIndex: 'price' }),
      ...getColumnSearchProps({
        dataIndex: 'price',
        searchInput,
        searchedColumn,
        searchText,
        normalizeText: USD,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'price',
        sorter: (a, b) => {
          return currency(a.price).value - currency(b.price).value
        },
      }),
    },
    {
      ...getColumnProps({
        title: 'Expired Date',
        dataIndex: 'expiration_date',
      }),
      ...getDateColumnSearchProps({
        dataIndex: 'expiration_date',
        initialFormat: 'MM-DD-YYYY',
        finalFormat: 'll',
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'expiration_date',
        type: 'date',
        format: 'MM-DD-YYYY',
      }),
    },
    {
      ...getColumnProps({
        title: 'Status',
        dataIndex: 'status',
      }),
      ...getColumnFilterProps({
        dataIndex: 'status',
        filters: [{ text: 'Completed', value: 'Completed' }],
      }),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      ...getColumnProps({ title: 'Sales Agent', dataIndex: 'user_name' }),
      ...getColumnSearchProps({
        dataIndex: 'user_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'user_name',
      }),
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
      dataSource={dataSource?.map(item => ({
        ...item,
        price: parseFloat(item.total_amount) + parseFloat(item.total_setup),
      }))}
      bordered
      pagination={{
        showTotal,
      }}
    />
  )
}
