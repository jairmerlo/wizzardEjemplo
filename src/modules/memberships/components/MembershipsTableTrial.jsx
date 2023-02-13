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
  DollarOutlined,
  EditTwoTone,
  EyeTwoTone,
  SearchOutlined,
} from '@ant-design/icons'
import {
  renderTextHighlighter,
  showTotal,
  stringFallback,
  USD,
} from '../../../helpers'
import moment from 'moment/moment'
import { Link } from 'react-router-dom'
import { useGetAllMembershipsQuery } from '../../../app/api/backoffice'
import currency from 'currency.js'

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

export const MembershipsTableTrial = ({ filter = 'trial' }) => {
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
    width: 200,
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
  const getColumnFilterProps = ({ dataIndex, filters }) => {
    return {
      filters,
      filterSearch: true,
      onFilter: (value, record) =>
        record[dataIndex] && record[dataIndex].startsWith(value),
    }
  }
  const columns = [
    {
      title: 'Product/Service',
      key: 'class_accounting_name',
      dataIndex: 'class_accounting_name',
      ...getColumnSearchProps('class_accounting_name'),
      ...getColumnSortProps('class_accounting_name'),
      fixed: 'left',
    },
    {
      title: 'Trial Due',
      key: 'trial_due',
      dataIndex: 'trial_due',
      ...getColumnSearchProps('trial_due'),
      render: date =>
        date
          ? moment(moment(date, 'YYYY-MM-DD')).isSameOrAfter(moment())
            ? moment(moment(date, 'YYYY-MM-DD')).fromNow(true) + ' left'
            : stringFallback(null, { fallback: 'Timed out' })
          : stringFallback(),
      onFilter: (value, record) => {
        const text = record['trial_due']
          ? moment(moment(record['trial_due'], 'YYYY-MM-DD')).isSameOrAfter(
              moment(),
            )
            ? moment(moment(record['trial_due'], 'YYYY-MM-DD')).fromNow(true) +
              ' left'
            : ''
          : ''
        return text.toString().toLowerCase().includes(value.toLowerCase())
      },
      ...getColumnSortProps('trial_due'),
      width: 120,
      fixed: 'left',
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
      ...getColumnSortProps('client_name'),
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    //   ...getColumnSearchProps('email'),
    //   ...getColumnSortProps('email'),
    // },
    // {
    //   title: 'URL',
    //   dataIndex: 'wordpress_install_url',
    //   key: 'wordpress_install_url',
    //   ...getColumnSearchProps('wordpress_install_url'),
    //   render: url => (
    //     <a href={url} target='_blank' rel='noreferrer'>
    //       {renderTextHighlighter({
    //         text: url,
    //         isHighlighted: searchedColumn['wordpress_install_url'],
    //         highlightedText: searchText['wordpress_install_url'],
    //       })}
    //     </a>
    //   ),
    //   ...getColumnSortProps('wordpress_install_url'),
    // },

    {
      title: 'Published Status',
      key: 'publication_dtate',
      dataIndex: 'publication_dtate',
      ...getColumnFilterProps({
        filters: [
          {
            text: 'Unpublished',
            value: 'Unpublished',
          },
        ],
        dataIndex: 'publication_dtate',
      }),
      width: 120,
    },
    {
      title: 'IDX',
      key: 'idx',
      dataIndex: 'idx',
      ...getColumnFilterProps({
        filters: [
          {
            text: 'No',
            value: 'No',
          },
          {
            text: 'Active',
            value: 'Active',
          },
        ],
        dataIndex: 'idx',
      }),
      width: 80,
    },
    {
      title: 'IDX Requested',
      key: 'idx_requested_date',
      dataIndex: 'idx_requested_date',
      ...getDateColumnSearchProps('idx_requested_date'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.idx_requested_date || '01/01/1970', 'MM/DD/YYYY'),
          ).diff(moment(b.idx_requested_date || '01/01/1970', 'MM/DD/YYYY'))
        },
      }),
      width: 120,
    },
    {
      title: 'Board',
      key: 'board_name',
      dataIndex: 'board_name',
      ...getColumnSearchProps('board_name'),
      ...getColumnSortProps('board_name'),
      ellipsis: true,
    },
    {
      title: 'Premium Requested',
      key: 'premium',
      dataIndex: 'premium',
      ...getColumnSearchProps('premium'),
    },
    {
      title: '$ Price',
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
      width: 120,
    },
    // {
    //   title: 'Periods',
    //   dataIndex: 'periods',
    //   key: 'periods',
    //   ...getColumnSearchProps('periods'),
    //   ...getCustomColumnSortProps({
    //     sorter: (a, b) => {
    //       return parseFloat(a.periods || 0) - parseFloat(b.periods || 0)
    //     },
    //   }),
    //   width: 120,
    // },
    // {
    //   title: '$ Monthly',
    //   dataIndex: 'amount',
    //   key: 'amount',
    //   ...getColumnSearchProps('amount'),
    //   width: 120,
    //   // render: monthlyAmount =>
    //   //   monthlyAmount ? (
    //   //     renderTextHighlighter({
    //   //       text: USD(monthlyAmount),
    //   //       isHighlighted: searchedColumn['monthly_amount'],
    //   //       highlightedText: searchText['monthly_amount'],
    //   //     })
    //   //   ) : (
    //   //     <NoDataCell />
    //   //   ),
    //   // onFilter: (value, record) =>
    //   //   USD(record['monthly_amount'])
    //   //     .toString()
    //   //     .toLowerCase()
    //   //     .includes(value.toLowerCase()),
    //   // ...getCustomColumnSortProps({
    //   //   sorter: (a, b) => {
    //   //     return parseFloat(a.monthly_amount) - parseFloat(b.monthly_amount)
    //   //   },
    //   // }),
    // },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { id }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
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
      fixed: 'right',
      width: '150px',
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
          Memberships Trial ({total})
        </Typography.Title>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Price:{' '}
          {typeof totalPrice === 'number' ? (
            USD(totalPrice, { precision: 2 })
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
        columns={columns}
        dataSource={memberships}
        bordered
        scroll={{ x: '100%' }}
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
