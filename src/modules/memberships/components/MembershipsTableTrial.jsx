import React, { useEffect, useReducer, useRef, useState } from 'react'
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
  DollarOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  getDateColumnSearchProps as getDateColumnSearchPropsExport,
  getColumnSortProps as getColumnSortPropsExport,
} from '../../../helpers'
import {
  renderTextHighlighter,
  showTotal,
  stringFallback,
  USD,
} from '../../../helpers'
import moment from 'moment/moment'
import { useGetAllMembershipsQuery } from '../../../app/api/backoffice'
import currency from 'currency.js'
import { useScroll } from '../../../hooks/useScroll'
import { useSelectedRow } from '../../../hooks/useSelectedRow'
import { useSearchParams } from 'react-router-dom'
import { Deleteicon, EditMemberhipIcon, Requesticon } from '.'

const reducer = (state, newState) => ({ ...state, ...newState })
const SEARCH_TEXT_INITIAL_STATE = {
  uuid: null,
  clientName: null,
  email_contact: null,
  phone: null,
  memberships: null,
  monthly_amount: null,
  created_on: null,
  trial_due: null,
}

const SEARCHED_COLUMN_INITIAL_STATE = {
  uuid: null,
  clientName: null,
  email_contact: null,
  phone: null,
  memberships: null,
  monthly_amount: null,
  created_on: null,
  trial_due: null,
}

export const MembershipsTableTrial = ({ filter = 'trial' }) => {
  let [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    size: 10,
  })
  const pageSize = parseInt(searchParams.get('size'))
  const page = parseInt(searchParams.get('page'))

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


  const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
    // console.log('Various parameters', pagination, filters, sorter)
    setTotalCurrentItems(currentDataSource?.length)
    setCurrentItems(currentDataSource)
  }
  const { saveSelectedRow, selectedRow } = useSelectedRow()
  const { initialScrollY } = useScroll('scrollY003')

  const [filtreredMembership, setFiltreredMembership] = useState([])
  const [filtredValue, setFiltredValue] = useState('')

  const resetFilters = () => {
    setTableKey(tableKey => tableKey + 1)
    setTotalCurrentItems(total)
    setFiltredValue('')
    // setFilteredRadioGroup({ value: 0, dataIndex: '', key: '' })
    setSearchParams({
      page: 1,
      size: 10,
    })
    // setTableKey(tableKey => tableKey + 1)
    // setSearchText(SEARCH_TEXT_INITIAL_STATE)
    // setSearchedColumn(SEARCHED_COLUMN_INITIAL_STATE)
    // setTotalCurrentItems(total)
    // setCurrentItems([])
  }

  useEffect(() => {
    if (memberships?.length > 0) {
      setFiltreredMembership(memberships)
    }
  }, [memberships?.length])

  useEffect(() => {
    if (filtredValue === '') {
      setFiltreredMembership(memberships)
      setSearchParams({
        page: 1,
        size: 10,
      })
      setTotalCurrentItems(total)
      return
    };
    const newMembership = memberships.filter(membership => {
      return membership.registration_key?.toString().toLowerCase().includes(filtredValue.toLowerCase()) ||
        membership.memberships_id?.toString().toLowerCase().includes(filtredValue.toLowerCase()) ||
        membership.client_name?.toString().toLowerCase().includes(filtredValue.toLowerCase()) ||
        membership.project_name?.toString().toLowerCase().includes(filtredValue.toLowerCase()) ||
        membership.email?.toString().toLowerCase().includes(filtredValue.toLowerCase()) ||
        membership.wordpress_install_url?.toString().toLowerCase().includes(filtredValue.toLowerCase())
    })
    setSearchParams({
      page: 1,
      size: 10,
    })
    setFiltreredMembership(newMembership)
    setTotalCurrentItems(newMembership.length)

  }, [filtredValue])


  useEffect(() => {
    if (memberships?.length !== 0) {
      window.scrollTo({ top: initialScrollY })
    }
  }, [memberships?.length])

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
        text: text,
        isHighlighted: searchedColumn[dataIndex],
        highlightedText: searchText[dataIndex],
      }),
    width: 200,
  })

  const getColumnSortProps = (dataIndex, opts) => {
    return {
      sorter: (a, b) => {
        return (a[dataIndex] || '').localeCompare(b[dataIndex] || '')
      },
      ellipsis: true,
      ...opts,
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
      title: 'Trial Due',
      key: 'trial_due',
      dataIndex: 'trial_due',
      ...getDateColumnSearchPropsExport({
        dataIndex: 'trial_due',
        onSearch: handleSearch,
        onReset: handleReset,
        initialFormat: 'YYYY-MM-DD',
        finalFormat: 'YYYY-MM-DD',
      }),
      render: (date, record) =>
        date ? (
          moment(moment(date, 'YYYY-MM-DD')).isSameOrAfter(moment()) ? (
            <Tooltip
              placement='topLeft'
              title={
                <>
                  Trial Date:{' '}
                  {record.created_at_date_time}
                  <br />
                  Ending Date:{' '}
                  {record.ending_date_trial}
                </>
              }
            >
              {/* {moment(date).fromNow(true) + ' left'} */}
              {date}
            </Tooltip>
          ) : (
            <Tooltip
              placement='topLeft'
              title={
                <>
                  Trial Date:{' '}
                  {record.created_at_date_time}
                  <br />
                  Ending Date:{' '}
                  {record.ending_date_trial}
                </>
              }
            >
              <span style={{ color: 'red' }}>
                {date}
              </span>
            </Tooltip>
          )
        ) : (
          stringFallback()
        ),
      ...getColumnSortPropsExport({
        dataIndex: 'trial_due',
        sorter: (a, b) => {
          // if (
          //   moment(moment(a['trial_due'], 'YYYY-MM-DD')).isSameOrAfter(moment())
          // )
          //   return moment().diff(moment(b['trial_due'], 'YYYY-MM-DD'))
          // return moment(moment(a['trial_due'], 'YYYY-MM-DD')).diff(
          //   moment(b['trial_due'], 'YYYY-MM-DD'),
          // )
          return parseInt(a.trial_due) - parseInt(b.trial_due)
        },
        ellipsis: {
          showTitle: false,
        },
      }),
      defaultSortOrder: 'ascend',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Created',
      dataIndex: 'created_at_date_time',
      key: 'created_at_date_time',
      ...getColumnSearchProps('last_action'),
      ...getColumnSortProps('last_action'),
      render: (date, record) => (
        <Tooltip
          placement='topLeft'
          title={record.created_at_hour}
        >
          {record.created_at}
        </Tooltip>
      ),
      fixed: 'left',
      width: 120,
    },
    {
      title: 'Last Action',
      dataIndex: 'last_action',
      key: 'last_action',
      ...getColumnSearchProps('last_action'),
      ...getColumnSortProps('last_action'),
      fixed: 'left',
      width: 150,
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.last_action}
        >
          {record.last_action}
        </Tooltip>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      ...getColumnSortProps('status'),
      fixed: 'left',
      width: 120,
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.status}
        >
          {record.status}
        </Tooltip>
      )
    },
    {
      title: 'Product/Service',
      key: 'class_accounting_name',
      dataIndex: 'class_accounting_name',
      ...getColumnSearchProps('class_accounting_name'),
      ...getColumnSortProps('class_accounting_name'),
      fixed: 'left',
      width: 150,
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.class_accounting_name}
        >
          {record.class_accounting_name}
        </Tooltip>
      )
    },

    {
      title: 'Membership ID',
      dataIndex: 'memberships_id',
      key: 'memberships_id',
      ...getColumnSearchProps('memberships_id'),
      ...getColumnSortProps('memberships_id'),
      width: 150,
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.memberships_id}
        >
          {record.memberships_id}
        </Tooltip>
      )
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
          <Tooltip
            placement='topLeft'
            title={
              <>
                {renderTextHighlighter({
                  text: clientName,
                  isHighlighted: searchedColumn['client_name'],
                  highlightedText: searchText['client_name'],
                })}
              </>
            }
          >
            {renderTextHighlighter({
              text: clientName,
              isHighlighted: searchedColumn['client_name'],
              highlightedText: searchText['client_name'],
            })}
          </Tooltip>
        </a>
      ),
      ...getColumnSortProps('client_name'),
      width: 150,
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.publication_dtate}
        >
          {record.publication_dtate}
        </Tooltip>
      )
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.idx}
        >
          {record.idx}
        </Tooltip>
      )
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.idx_requested_date}
        >
          {record.idx_requested_date}
        </Tooltip>
      )
    },
    {
      title: 'Board',
      key: 'board_name',
      dataIndex: 'board_name',
      ...getColumnSearchProps('board_name'),
      ...getColumnSortProps('board_name'),
      ellipsis: true,
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.board_name}
        >
          {record.board_name}
        </Tooltip>
      )
    },
    {
      title: 'Premium Requested',
      key: 'premium',
      dataIndex: 'premium',
      ...getColumnSearchProps('premium'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.premium}
        >
          {record.premium}
        </Tooltip>
      )
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.price}
        >
          {record.price}
        </Tooltip>
      )
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
      width: 90,
      render: (text, { id, registration_key }) => (
        <Popover
          placement='bottom'
          title={text}
          content={
            <Space size='middle' direction='vertical'>
              {/* eslint-disable jsx-a11y/anchor-is-valid */}

              <Popover
                placement='bottom'
                title={text}
                content={
                  <Space size='middle' direction='vertical'>
                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Tooltip title='CPanel'>
                      <a href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/cpanel/${id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: '#000',
                            fontSize: '15px'
                          }}
                        >
                          <span className='back-office-rocket' style={{ fontSize: '20px' }}></span>
                          CPanel
                        </div>
                      </a>
                    </Tooltip>

                    <Tooltip title='Wordpress'>
                      <a href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/wordpress/${id}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: '#000',
                            fontSize: '15px'
                          }}
                        >
                          <span className='back-office-wordpress' style={{ fontSize: '20px' }}></span>
                          Wordpress
                        </div>
                      </a>
                    </Tooltip>


                    {/* <Cpanelicon registration_key={registration_key} /> */}

                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                  </Space>
                }
                trigger='click'
              >
                <Tooltip title='Login'>
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
                      <span className='back-office-key' style={{ fontSize: '20px' }}></span>
                      LOGIN
                    </div>
                  </a>
                </Tooltip>
              </Popover>


              <Tooltip title='Details'>
                <a
                  href={`${window.location.origin}/customers/v2/customers#/membership-details/${registration_key}`}
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
                    VIEW
                  </div>
                </a>
              </Tooltip>
              <EditMemberhipIcon registration_key={registration_key} />

              {/* <SendMembershipicon registration_key={registration_key} /> */}

              <Requesticon registration_key={registration_key} id={id} />

              <Tooltip title='ONB'>
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
                    <span className='back-office-menu' style={{ fontSize: '20px' }}></span>
                    ONB
                  </div>
                </a>
              </Tooltip>

              <Tooltip title='Accounting classifications'>
                <a href={`${window.location.origin}/accounting/memberships/accounting_classification/${id}`} target='_blank' rel='noreferrer'>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
                    <p style={{ textAlign: 'center' }}>ACCOUNTING
                      <br /> CLASSIFICATIONS</p>
                  </div>
                </a>
              </Tooltip>

              <Deleteicon registration_key={registration_key} />


              {/* eslint-enable jsx-a11y/anchor-is-valid */}
            </Space>
          }
          trigger='hover'
        >
          <a>
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
      fixed: 'right',
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
          justifyContent: 'space-between'
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <Typography.Title level={5}>
            Search:
          </Typography.Title>
          {/* {console.log({ memberships })} */}
          <Input.Search
            disabled={!memberships}
            onSearch={(value) => setFiltredValue(value)}
            value={filtredValue}
            onChange={(e) => setFiltredValue(e.target.value)}
            size='large'
            style={{
              width: '300px',
              marginLeft: '15px'
            }}
          />
        </div>
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
        dataSource={filtreredMembership}
        bordered
        rowSelection={{
          selectedRowKeys: selectedRow,
          renderCell: () => '',
          columnTitle: ' ',
          columnWidth: '8px',
        }}
        scroll={{ x: '100%' }}
        loading={isLoading}
        onChange={handleChange}
        pagination={{
          total: totalCurrentItems || total,
          pageSize,
          current: page,
          showQuickJumper: true,
          showSizeChanger: true,
          onChange: (page, pageSize) => {
            setSearchParams({
              page: page,
              size: pageSize,
            })
          },
          showTotal,
        }}
      />
    </div>
  )
}
