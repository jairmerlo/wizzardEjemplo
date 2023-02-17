import React, { useReducer, useRef, useState } from 'react'
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Popover,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import {
  DeleteTwoTone,
  DollarOutlined,
  EditTwoTone,
  EyeTwoTone,
  SearchOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import {
  capitalize,
  renderTextHighlighter,
  showTotal,
  USD,
} from '../../../helpers'
import moment from 'moment/moment'
import { useGetAllMembershipsQuery } from '../../../app/api/backoffice'
import currency from 'currency.js'
import { MembershipEdit, LastActionCell } from '.'
import numbro from 'numbro'

const reducer = (state, newState) => ({ ...state, ...newState })
const SEARCH_TEXT_INITIAL_STATE = {
  uuid: null,
  clientName: null,
  email_contact: null,
  phone: null,
  memberships: null,
  monthly_amount: null,
  created_on: null,
}

const SEARCHED_COLUMN_INITIAL_STATE = {
  uuid: null,
  clientName: null,
  email_contact: null,
  phone: null,
  memberships: null,
  monthly_amount: null,
  created_on: null,
}

export const MembershipsTable = ({ filter = '' }) => {
  const [pageSize, setPageSize] = useState(10)
  const [totalCurrentItems, setTotalCurrentItems] = useState()
  const { data = {}, isLoading } = useGetAllMembershipsQuery({
    filter,
  })
  const { data: memberships, total } = data
  const [currentItems, setCurrentItems] = useState([])
  const items = currentItems.length !== 0 ? currentItems : memberships
  const totalPrice = items
    ?.map(item => currency(item.price || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)
  const totalMonthly = items
    ?.map(item => currency(item.amount || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)
  console.log({ memberships })

  const [tableKey, setTableKey] = useState(0)
  const [searchText, setSearchText] = useReducer(
    reducer,
    SEARCH_TEXT_INITIAL_STATE,
  )
  const [searchedColumn, setSearchedColumn] = useReducer(
    reducer,
    SEARCHED_COLUMN_INITIAL_STATE,
  )
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText({ [dataIndex]: selectedKeys[0] })
    setSearchedColumn({ [dataIndex]: true })
  }
  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters()
    confirm({ closeDropdown: true })
    setSearchedColumn({ [dataIndex]: false })
    setSearchText({ [dataIndex]: '' })
  }
  const resetFilters = () => {
    setTableKey(tableKey => tableKey + 1)
    setSearchText(SEARCH_TEXT_INITIAL_STATE)
    setSearchedColumn(SEARCHED_COLUMN_INITIAL_STATE)
    setTotalCurrentItems(total)
    setCurrentItems([])
  }

  const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
    // console.log('Various parameters', pagination, filters, sorter)
    setTotalCurrentItems(currentDataSource?.length)
    setCurrentItems(currentDataSource)
  }

  const getDateColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}
      >
        <DatePicker
          value={selectedKeys[0]}
          onChange={e => {
            console.log(e.format('DD-MM-YYYY'))
            setSelectedKeys([e])
          }}
          allowClear={true}
          style={{ width: '100%' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm, dataIndex)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) => {
      return (
        moment(moment(record[dataIndex], 'MM-DD-YYYY')).format('DD-MM-YYYY') ===
        value.format('DD-MM-YYYY')
      )
    },
  })
  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={e => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset(clearFilters, confirm, dataIndex)
            }
            size='small'
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: filtered => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      const text = record[dataIndex] || ''
      return text.toString().toLowerCase().includes(value.toLowerCase())
    },
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text = '') =>
      renderTextHighlighter({
        text,
        isHighlighted: searchedColumn[dataIndex],
        highlightedText: searchText[dataIndex],
      }),
  })

  const getColumnSortProps = dataIndex => {
    return {
      sorter: (a, b) => {
        return (a[dataIndex] || '').localeCompare(b[dataIndex] || '')
      },
      ellipsis: true,
    }
  }

  const getCustomColumnSortProps = ({ sorter }) => {
    return {
      sorter,
      ellipsis: true,
    }
  }
  const columns = [
    {
      title: 'Last Action',
      dataIndex: 'lastAction',
      key: 'lastAction',
      ...getColumnSearchProps('lastAction'),
      render: (text, record) => (
        <LastActionCell
          text={text}
          isHighlighted={searchedColumn['lastAction']}
          highlightedText={searchText['lastAction']}
          registration_key={record.registration_key}
          membershipId={record.memberships_id}
        />
      ),
      ...getColumnSortProps('lastAction'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      ...getColumnSortProps('status'),
    },
    {
      title: 'Membership ID',
      dataIndex: 'memberships_id',
      key: 'memberships_id',
      ...getColumnSearchProps('memberships_id'),
      ...getColumnSortProps('memberships_id'),
    },
    {
      title: 'Client Name',
      dataIndex: 'client_name',
      key: 'client_name',
      ...getColumnSearchProps('client_name'),
      render: (clientName, record) => (
        <a
          href={`${window.location.origin}/customers/v2/customers#/customer-view/${record.customer_id}`}
          rel='noreferrer'
        >
          {renderTextHighlighter({
            text: clientName,
            isHighlighted: searchedColumn['client_name'],
            highlightedText: searchText['client_name'],
          })}
        </a>
      ),
      ...getColumnSortProps('client_name'),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      ...getColumnSortProps('email'),
    },
    {
      title: 'URL',
      dataIndex: 'wordpress_install_url',
      key: 'wordpress_install_url',
      ...getColumnSearchProps('wordpress_install_url'),
      render: url => (
        <a href={url} target='_blank' rel='noreferrer'>
          {renderTextHighlighter({
            text: url,
            isHighlighted: searchedColumn['wordpress_install_url'],
            highlightedText: searchText['wordpress_install_url'],
          })}
        </a>
      ),
      ...getColumnSortProps('wordpress_install_url'),
    },
    {
      title: 'Product/Service',
      key: 'class_accounting_name',
      dataIndex: 'class_accounting_name',
      ...getColumnSearchProps('class_accounting_name'),
      ...getColumnSortProps('class_accounting_name'),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      ...getDateColumnSearchProps('created_at'),
      render: date => moment(moment(date, 'MM-DD-YYYY')).format('ll'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(moment(a.created_at, 'MM-DD-YYYY')).diff(
            moment(b.created_at, 'MM-DD-YYYY'),
          )
        },
      }),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      ...getColumnSearchProps('price'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return (
            parseFloat(currency(a.price).value) -
            parseFloat(currency(b.price).value)
          )
        },
      }),
    },
    {
      title: 'Periods',
      dataIndex: 'periods',
      key: 'periods',
      ...getColumnSearchProps('periods'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return parseFloat(a.periods || 0) - parseFloat(b.periods || 0)
        },
      }),
    },
    {
      title: 'Monthly Amount',
      dataIndex: 'amount',
      key: 'amount',
      ...getColumnSearchProps('amount'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return (
            parseFloat(currency(a.amount).value) -
            parseFloat(currency(b.amount).value)
          )
        },
      }),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 90,
      render: (text, { registration_key }) => (
        <Popover
          placement='bottom'
          title={text}
          content={
            <Space size='middle' direction='vertical'>
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <Tooltip title='Details'>
                <a
                  href={`${window.location.origin}/customers/v2/customers#/membership-details/${registration_key}`}
                >
                  <EyeTwoTone style={{ fontSize: '18px' }} />
                </a>
              </Tooltip>
              <MembershipEdit registration_key={registration_key} />
              <Tooltip title='Delete'>
                <a>
                  <DeleteTwoTone style={{ fontSize: '18px' }} />
                </a>
              </Tooltip>
              {/* eslint-enable jsx-a11y/anchor-is-valid */}
            </Space>
          }
          trigger='click'
        >
          <a>
            <ToolOutlined style={{ fontSize: '24px' }} />
          </a>
        </Popover>
      ),
    },
  ]
  return (
    <div
      style={{
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: '32px',
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Memberships{' '}
          {filter
            ? filter
                .split('_')
                .map(word => capitalize(word))
                .join(' ')
            : 'Active'}{' '}
          ({numbro(total).format({ thousandSeparated: true }) ?? '...'})
        </Typography.Title>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Price:{' '}
          {typeof totalPrice === 'number' ? (
            USD(totalPrice, { precision: 2 })
          ) : (
            <DollarOutlined spin />
          )}
        </Typography.Title>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Monthly:{' '}
          {typeof totalMonthly === 'number' ? (
            USD(totalMonthly, { precision: 2 })
          ) : (
            <DollarOutlined spin />
          )}
        </Typography.Title>
        {/* <Link to='/new-quote'>
          <Button
            type='primary'
            shape='round'
            icon={<UserAddOutlined />}
            size='middle'
            style={{
              alignSelf: 'flex-end',
            }}
          >
            Add New Customer
          </Button>
        </Link> */}
      </div>
      <Divider dashed />
      <Button
        type='default'
        style={{ marginBottom: 8, marginLeft: 'auto' }}
        onClick={resetFilters}
      >
        Reset
      </Button>
      <Table
        key={tableKey}
        rowKey='id'
        columns={
          filter === 'idx_requested'
            ? [
                {
                  title: 'IDX Requested',
                  key: 'idx_requested_date',
                  dataIndex: 'idx_requested_date',
                  ...getDateColumnSearchProps('idx_requested_date'),
                  ...getCustomColumnSortProps({
                    sorter: (a, b) => {
                      return moment(
                        moment(
                          a.idx_requested_date || '01/01/1970',
                          'MM/DD/YYYY',
                        ),
                      ).diff(
                        moment(
                          b.idx_requested_date || '01/01/1970',
                          'MM/DD/YYYY',
                        ),
                      )
                    },
                  }),
                },
                ...columns,
              ]
            : columns
        }
        dataSource={memberships}
        bordered
        loading={isLoading}
        onChange={handleChange}
        pagination={{
          total: totalCurrentItems || total,
          pageSize,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, pageSize) => setPageSize(pageSize),
          showTotal,
        }}
      />
    </div>
  )
}
