import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
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
  UserAddOutlined,
} from '@ant-design/icons'
import {
  capitalize,
  renderTextHighlighter,
  showTotal,
  USD,
} from '../../../helpers'
import { useGetAllCustomersQuery } from '../../../app/api/billing'
import moment from 'moment/moment'
import { Link, useSearchParams } from 'react-router-dom'
import currency from 'currency.js'
import { API } from '../../../api'
import numbro from 'numbro'
import { useEvent } from 'react-use'
import { useSelectedRow } from '../../../hooks/useSelectedRow'
import '../../../icons/style.css'

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
  // console.log({ API })
  let [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    size: 10,
  })
  // console.log({
  //   page: searchParams.get('page'),
  // })
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')))
  const [page, setPage] = useState(parseInt(searchParams.get('page')))
  const [totalCurrentItems, setTotalCurrentItems] = useState()
  const [currentItems, setCurrentItems] = useState([])
  const { data, isLoading } = useGetAllCustomersQuery({
    filter,
  })
  const items = currentItems.length !== 0 ? currentItems : data
  const totalData = data?.length
  const totalLifetime = items
    ?.map(item => currency(item.monthly_amount).value ?? 0)
    .reduce((a, b) => a + b, 0)
  const totalMonthly = items
    ?.map(item => currency(item.monthly).value ?? 0)
    .reduce((a, b) => a + b, 0)
  // console.log({ totalLifetime, totalMonthly, items })

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
    setCurrentItems([])
  }

  const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
    // console.log('Various parameters', pagination, filters, sorter)
    setTotalCurrentItems(currentDataSource?.length)
    setCurrentItems(currentDataSource)
  }

  const onScroll = useCallback(() => {
    localStorage.setItem('scrollY', window.scrollY.toString())
  }, [])

  useEvent('scroll', onScroll)

  useEffect(() => {
    if (data?.length !== 0) {
      window.scrollTo({ top: parseInt(localStorage.getItem('scrollY') || 0) })
    }
  }, [data?.length])

  const { selectedRow, saveSelectedRow } = useSelectedRow('selectedRow')

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
            // console.log(e.format('DD-MM-YYYY'))
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.uuid}
        >
          {record.uuid}
        </Tooltip>
      ),
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      ...getColumnSearchProps('clientName'),
      render: (text, record) =>
        <Tooltip
          placement='topLeft'
          title={`${record.name} ${record.last_name}`}
        >
          {renderTextHighlighter({
            text: `${record?.name} ${record.last_name}`,
            isHighlighted: searchedColumn['clientName'],
            highlightedText: searchText['clientName'],
          })}
        </Tooltip>
      ,
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.email_contact}
        >
          {record.email_contact}
        </Tooltip>
      ),
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
      ...getColumnSearchProps('phone'),
      ...getColumnSortProps('phone'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.phone}
        >
          {record.phone}
        </Tooltip>
      ),
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.memberships}
        >
          {record.memberships}
        </Tooltip>
      ),
    },
    {
      title: 'Monthly',
      dataIndex: 'monthly',
      key: 'monthly',
      ...getColumnSearchProps('monthly'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return (
            parseFloat(currency(a.monthly).value) -
            parseFloat(currency(b.monthly).value)
          )
        },
      }),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.monthly}
        >
          {record.monthly}
        </Tooltip>
      ),
    },
    // {
    //   title: '$ Lifetime',
    //   dataIndex: 'monthly_amount',
    //   key: 'monthly_amount',
    //   ...getColumnSearchProps('monthly_amount'),
    //   ...getCustomColumnSortProps({
    //     sorter: (a, b) => {
    //       return (
    //         parseFloat(currency(a.monthly_amount).value) -
    //         parseFloat(currency(b.monthly_amount).value)
    //       )
    //     },
    //   }),
    //   render: (text, record) => (
    //     <Tooltip
    //       placement='topLeft'
    //       title={record.monthly_amount}
    //     >
    //       {record.monthly_amount}
    //     </Tooltip>
    //   ),
    // },
    {
      title: 'Since',
      dataIndex: 'created_on',
      key: 'created_on',
      ...getDateColumnSearchProps('created_on'),
      render: date => (
        <Tooltip
          placement='topLeft'
          title={moment(moment(date, 'MM-DD-YYYY')).format('ll')}
        >
          {/* {record.monthly_amount} */}
          {moment(moment(date, 'MM-DD-YYYY')).format('ll')}
        </Tooltip>

      ),
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
      render: (text, { id, uuid }) => (
        <Popover
          placement='bottom'
          title={text}
          content={
            <Space size='middle' direction='vertical'>
              {/* eslint-disable jsx-a11y/anchor-is-valid */}
              <Tooltip title='Add Membership'>
                <Link to={`/new-quote?customerId=${id}`}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
                    ADD USER
                  </div>
                </Link>
              </Tooltip>
              <Tooltip title='Details'>
                <Link
                  to={`/customer-view/${uuid}`}
                  onClick={() => saveSelectedRow(uuid)}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-eye' style={{ fontSize: '20px' }}></span>
                    DETAILS
                  </div>
                </Link>
              </Tooltip>
              <Tooltip title='Edit'>
                <Link
                  to={`/customer-edit/${id}`}
                  onClick={() => saveSelectedRow(id)}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-edit' style={{ fontSize: '20px' }}></span>
                    EDIT
                  </div>
                </Link>
              </Tooltip>
              <Tooltip title='Delete'>
                <a >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-delete' style={{ fontSize: '20px' }}></span>
                    DELETE
                  </div>
                </a>
              </Tooltip>
              {/* eslint-enable jsx-a11y/anchor-is-valid */}
            </Space>
          }
        >
          <a >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#858faf',
                fontSize: '10px'
              }}
            >
              <span className='back-office-tools' style={{ fontSize: '30px' }}></span>
              TOOLBOX
            </div>
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
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'baseline',
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {filter ? capitalize(filter) : 'Active'} Customers (
            {numbro(totalData).format({ thousandSeparated: true }) ?? '...'})
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Monthly:{' '}
            {typeof totalMonthly === 'number' ? (
              USD(totalMonthly, { precision: 2 })
            ) : (
              <DollarOutlined spin />
            )}
          </Typography.Title>
          {/* <Typography.Title level={5} style={{ margin: 0 }}>
            $ Lifetime:{' '}
            {typeof totalLifetime === 'number' ? (
              USD(totalLifetime, { precision: 2 })
            ) : (
              <DollarOutlined spin />
            )}
          </Typography.Title> */}
        </div>
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
        className='mainTable'
        key={tableKey}
        rowKey='id'
        columns={columns}
        dataSource={data}
        bordered
        loading={isLoading}
        onChange={handleChange}
        rowSelection={{
          selectedRowKeys: selectedRow,
          renderCell: () => '',
          columnTitle: ' ',
          columnWidth: '8px',
        }}
        pagination={{
          total: totalCurrentItems || totalData,
          pageSize,
          current: page,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setPageSize(pageSize)
            setPage(page)
            setSearchParams({
              size: pageSize,
              page,
            })
          },
          showTotal,
        }}
      />
    </div>
  )
}
