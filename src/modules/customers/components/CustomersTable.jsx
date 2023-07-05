import React, { useReducer } from 'react'
import {
  Button,
  Divider,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd'
import {
  DeleteTwoTone,
  EditTwoTone,
  EyeTwoTone,
  UserAddOutlined,
} from '@ant-design/icons'
import { showTotal, USD } from '../../../helpers'
import { useGetCustomersQuery } from '../../../app/api/billing'
import moment from 'moment/moment'
import { CustomerView } from '.'
import { useSearchParams } from 'react-router-dom'
import { NoDataCell } from '../../../components'

const reducer = (state, newState) => ({ ...state, ...newState })

export const CustomersTable = () => {
  const [pagination, dispatch] = useReducer(reducer, {
    page: 1,
    pageSize: 10,
  })
  const { page, pageSize } = pagination
  const { data, isLoading } = useGetCustomersQuery({
    page,
    pageSize,
  })
  const total = data?.pagination.total
  let [searchParams, setSearchParams] = useSearchParams()

  const customerId = searchParams.get('id')
  const screen = searchParams.get('screen')

  const onOpen = ({ id, screen }) => {
    setSearchParams({
      id,
      screen,
    })
  }

  const onClose = () => {
    setSearchParams({})
  }

  // const [searchText, setSearchText] = useReducer(reducer, {})
  // const [searchedColumn, setSearchedColumn] = useReducer(reducer, {})
  // const searchInput = useRef(null)
  // const handleSearch = (selectedKeys, confirm, dataIndex) => {
  //   confirm()
  //   setSearchText({ [dataIndex]: selectedKeys[0] })
  //   setSearchedColumn({ [dataIndex]: true })
  // }
  // const handleReset = (clearFilters, confirm, dataIndex) => {
  //   clearFilters()
  //   confirm({ closeDropdown: true })
  //   setSearchedColumn({ [dataIndex]: false })
  //   setSearchText({ [dataIndex]: '' })
  // }

  // const getColumnDateSearchProps = dataIndex => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }) => (
  //     <div style={{ padding: 8 }}>
  //       <Space>
  //         <DatePicker
  //           // format={"DD-MM-YY"}
  //           onChange={e => {
  //             setSelectedKeys([e])
  //           }}
  //           allowClear={true}
  //         />
  //       </Space>
  //       <Space>
  //         <Button
  //           type='primary'
  //           onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size='small'
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => this.handleReset(clearFilters)}
  //           size='small'
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //         <Button
  //           type='link'
  //           size='small'
  //           onClick={() => {
  //             confirm({ closeDropdown: false })
  //             this.setState({
  //               searchText: selectedKeys[0],
  //               searchedColumn: dataIndex,
  //             })
  //           }}
  //         >
  //           Filter
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: filtered => (
  //     <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  //   ),
  //   onFilter: (value, record) => {
  //     return (
  //       moment(record[dataIndex]).format('DD-MM-YYYY') ===
  //       value.format('DD-MM-YYYY')
  //     )
  //   },
  // })
  // const getColumnSearchProps = dataIndex => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //     close,
  //   }) => (
  //     <div
  //       style={{
  //         padding: 8,
  //       }}
  //       onKeyDown={e => e.stopPropagation()}
  //     >
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={e =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //         style={{
  //           marginBottom: 8,
  //           display: 'block',
  //         }}
  //       />
  //       <Space>
  //         <Button
  //           type='primary'
  //           onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
  //           icon={<SearchOutlined />}
  //           size='small'
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() =>
  //             clearFilters && handleReset(clearFilters, confirm, dataIndex)
  //           }
  //           size='small'
  //           style={{
  //             width: 90,
  //           }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: filtered => (
  //     <SearchOutlined
  //       style={{
  //         color: filtered ? '#1890ff' : undefined,
  //       }}
  //     />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  //   onFilterDropdownOpenChange: visible => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100)
  //     }
  //   },
  //   render: text =>
  //     renderTextHighlighter({
  //       text,
  //       isHighlighted: searchedColumn[dataIndex],
  //       highlightedText: searchText[dataIndex],
  //     }),
  // })
  const columns = [
    {
      title: 'Customer ID',
      dataIndex: 'uuid',
      key: 'uuid',
    },
    {
      title: 'Client Name',
      dataIndex: 'clientName',
      key: 'clientName',
      render: (text, record) => `${record?.name} ${record.last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'email_contact',
      key: 'email_contact',
    },
    {
      title: 'Phone',
      key: 'phone',
      dataIndex: 'phone',
    },
    {
      title: 'Membership',
      dataIndex: 'memberships',
      key: 'memberships',
    },
    {
      title: 'Monthly Amount',
      dataIndex: 'monthlyamount',
      key: 'monthlyamount',
      render: monthlyAmount =>
        monthlyAmount ? USD(monthlyAmount) : <NoDataCell />,
    },
    // {
    //   title: 'Status',
    //   dataIndex: 'status',
    //   key: 'status',
    //   render: status => (
    //     <Tag color={getStatusColor(status)}>
    //       {status.charAt(0).toUpperCase() + status.slice(1)}
    //     </Tag>
    //   ),
    // },
    {
      title: 'Since',
      dataIndex: 'created_on',
      key: 'created_on',
      render: date => moment(moment(date, 'MM-DD-YYYY')).format('ll'),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { id }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <Tooltip title='Add Membership'>
            <a>
              <UserAddOutlined style={{ fontSize: '18px' }} />
            </a>
          </Tooltip>
          <Tooltip title='Details'>
            <a onClick={() => onOpen({ id, screen: 'details' })}>
              <EyeTwoTone style={{ fontSize: '18px' }} />
            </a>
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
          Customer List ({total})
        </Typography.Title>
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
      </div>
      <Divider dashed />
      <Table
        rowKey='uuid'
        columns={columns}
        dataSource={data?.results}
        bordered
        loading={isLoading}
        pagination={{
          total,
          current: page,
          pageSize: pageSize,
          onChange: (page, pageSize) => dispatch({ page, pageSize }),
          showQuickJumper: true,
          showTotal,
        }}
      />
      {customerId && screen === 'details' && (
        <CustomerView
          open={customerId && screen === 'details'}
          onClose={onClose}
        />
      )}
    </div>
  )
}
