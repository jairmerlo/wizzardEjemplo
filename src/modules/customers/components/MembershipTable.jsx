import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Input, Space, Table, Tag, Tooltip } from 'antd'
import { useReducer, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  date,
  getColumnProps,
  renderTextHighlighter,
  showTotal,
} from '../../../helpers'
import { getStatusColor } from '../helpers'
const reducer = (state, newState) => ({ ...state, ...newState })
const SEARCH_TEXT_INITIAL_STATE = {
  membership_id: null,
  wordpress_install_url: null,
  accounting_class_name: null,
  created_at: null,
  price: null,
  periods: null,
  amount: null,
  status: null,
}

const SEARCHED_COLUMN_INITIAL_STATE = {
  membership_id: null,
  wordpress_install_url: null,
  accounting_class_name: null,
  created_at: null,
  price: null,
  periods: null,
  amount: null,
  status: null,
}

export const MembershipTable = ({ memberships }) => {
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
  const columns = [
    {
      title: 'Membership ID',
      dataIndex: 'membership_id',
      key: 'membership_id',
      ...getColumnSearchProps('membership_id'),
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
    },
    {
      ...getColumnProps({
        title: 'Product/Service',
        dataIndex: 'accounting_class_name',
      }),
      ...getColumnSearchProps('accounting_class_name'),
    },
    {
      ...getColumnProps({ title: 'Created Date', dataIndex: 'created_at' }),
      ...getColumnSearchProps('created_at'),
      render: text => date(text),
    },
    {
      ...getColumnProps({ title: '$ Price', dataIndex: 'price' }),
      ...getColumnSearchProps('price'),
    },
    {
      ...getColumnProps({ title: 'Periods', dataIndex: 'periods' }),
      ...getColumnSearchProps('periods'),
    },
    // {
    //   title: '$ Lifetime',
    //   dataIndex: 'amount',
    //   key: 'amount',
    //   ...getColumnSearchProps('amount'),
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
      ...getColumnSearchProps('status'),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { registration_key }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
            <Link to={`/membership-details/${registration_key}`}>
              <EyeTwoTone style={{ fontSize: '18px' }} />
            </Link>
          </Tooltip>
          <Tooltip title='Edit' overlayStyle={{ zIndex: 10000 }}>
            <a>
              <EditTwoTone style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          <Tooltip title='Delete' overlayStyle={{ zIndex: 10000 }}>
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
