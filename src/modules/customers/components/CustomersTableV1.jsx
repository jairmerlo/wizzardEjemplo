import React, { useReducer, useRef, useState } from 'react'
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  SearchOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { renderTextHighlighter, showTotal, USD } from '../../../helpers'
import { useGetAllCustomersQuery } from '../../../app/api/billing'
import moment from 'moment/moment'
import { NoDataCell } from '../../../components'
import { Link } from 'react-router-dom'

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

export const CustomersTableV1 = ({ filter }) => {
  const [pageSize, setPageSize] = useState(10)
  const [totalCurrentItems, setTotalCurrentItems] = useState()
  const { data, isLoading } = useGetAllCustomersQuery({
    filter,
  })
  const totalData = data?.length

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
    setTotalCurrentItems(totalData)
  }

  const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
    // console.log('Various parameters', pagination, filters, sorter)
    setTotalCurrentItems(currentDataSource?.length)
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: visible => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: text =>
      renderTextHighlighter({
        text,
        isHighlighted: searchedColumn[dataIndex],
        highlightedText: searchText[dataIndex],
      }),
  })

  const getColumnSortProps = dataIndex => {
    return {
      sorter: (a, b) => {
        return a[dataIndex].localeCompare(b[dataIndex])
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
      title: 'Customer ID',
      dataIndex: 'uuid',
      key: 'uuid',
      ...getColumnSearchProps('uuid'),
      ...getColumnSortProps('uuid'),
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      ...getColumnSearchProps('clientName'),
      render: (text, record) =>
        renderTextHighlighter({
          text: `${record?.name} ${record.last_name}`,
          isHighlighted: searchedColumn['clientName'],
          highlightedText: searchText['clientName'],
        }),
      onFilter: (value, record) =>
        `${record?.name} ${record.last_name}`
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return `${a.name} ${a.last_name}`.localeCompare(
            `${b.name} ${b.last_name}`,
          )
        },
      }),
    },
    {
      title: 'Email',
      dataIndex: 'email_contact',
      key: 'email_contact',
      ...getColumnSearchProps('email_contact'),
      ...getColumnSortProps('email_contact'),
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
      ...getColumnSortProps('phone'),
    },
    {
      title: 'Membership',
      dataIndex: 'memberships',
      key: 'memberships',
      ...getColumnSearchProps('memberships'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return parseFloat(a.memberships) - parseFloat(b.memberships)
        },
      }),
    },
    {
      title: 'Price',
      dataIndex: 'monthly_amount',
      key: 'monthly_amount',
      ...getColumnSearchProps('monthly_amount'),
      render: monthlyAmount =>
        monthlyAmount ? (
          renderTextHighlighter({
            text: USD(monthlyAmount),
            isHighlighted: searchedColumn['monthly_amount'],
            highlightedText: searchText['monthly_amount'],
          })
        ) : (
          <NoDataCell />
        ),
      onFilter: (value, record) =>
        USD(record['monthly_amount'])
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return parseFloat(a.monthly_amount) - parseFloat(b.monthly_amount)
        },
      }),
    },
    {
      title: 'Since',
      dataIndex: 'created_on',
      key: 'created_on',
      ...getDateColumnSearchProps('created_on'),
      render: date => moment(moment(date, 'MM-DD-YYYY')).format('ll'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(moment(a.created_on, 'MM-DD-YYYY')).diff(
            moment(b.created_on, 'MM-DD-YYYY'),
          )
        },
      }),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { id }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <Tooltip title='Add Membership'>
            <Link to={`/new-quote?customerId=${id}`}>
              <UserAddOutlined style={{ fontSize: '18px' }} />
            </Link>
          </Tooltip>
          <Tooltip title='Details'>
            <Link to={`/customer-view/${id}`}>
              <EyeTwoTone style={{ fontSize: '18px' }} />
            </Link>
          </Tooltip>
          <Tooltip title='Edit'>
            <a>
              <EditTwoTone style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          <Tooltip title='Delete'>
            <a>
              <DeleteTwoTone style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          {/* eslint-enable jsx-a11y/anchor-is-valid */}
        </Space>
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={4} style={{ margin: 0 }}>
          Customer List ({totalData})
        </Typography.Title>
        <Link to='/new-quote'>
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
        </Link>
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
        columns={columns}
        dataSource={data}
        bordered
        loading={isLoading}
        onChange={handleChange}
        pagination={{
          total: totalCurrentItems || totalData,
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
