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
  Radio,
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
  capitalize,
  getColumnProps,
  renderTextHighlighter,
  showTotal,
  USD,
} from '../../../helpers'
import moment from 'moment/moment'
import { useGetAllMembershipsQuery } from '../../../app/api/backoffice'
import currency from 'currency.js'
import { LastActionCell, EditMemberhipIcon, Requesticon, Deleteicon, BillingEnrollment } from '.'
import numbro from 'numbro'
import { useSearchParams } from 'react-router-dom'
import { useCss, useEvent } from 'react-use'
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

export const MembershipsTable = ({ filter = '' }) => {
  let [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    size: 10,
  })
  const [filtreredMembership, setFiltreredMembership] = useState([])
  const [filtredValue, setFiltredValue] = useState('')


  // const [filteredValueColumn, setFilteredValueColumn] = useState({ value: '', dataIndex: '' })
  // const [sortAscending, setSortAscending] = useState('')
  // const [sortDescending, setSortDescending] = useState('')
  const [sortColumn, setSortColumn] = useState({ sort: '', dataIndex: '' })
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('size')))
  const [page, setPage] = useState(parseInt(searchParams.get('page')))
  const onScroll = useCallback(() => {
    localStorage.setItem('scrollY002', window.scrollY.toString())
  }, [])

  const [filteredRadioGroup, setFilteredRadioGroup] = useState({ value: 0, dataIndex: '', key: '' })
  const [filteredNumber, setFilteredNumber] = useState({ less: 0, greater: 0, dataIndex: '', value: '' })
  // console.log({ filteredNumber })
  useEvent('scroll', onScroll)

  const [totalCurrentItems, setTotalCurrentItems] = useState()
  const { data = {}, isLoading } = useGetAllMembershipsQuery({
    filter,
  })

  const { data: memberships, total } = data

  useEffect(() => {
    if (memberships?.length > 0) {
      setFiltreredMembership(memberships)
    }
  }, [memberships?.length])


  useEffect(() => {
    if (sortColumn.dataIndex === '') {
      setSearchParams({
        page: 1,
        size: 10,
      })
      setFiltreredMembership(memberships)
      setTotalCurrentItems(total)
      return
    }
    const membershipCopy = [...memberships]

    if (sortColumn.sort === 'asc') {
      membershipCopy.sort((a, b) => {
        if (a[sortColumn.dataIndex] === null && b[sortColumn.dataIndex] === null) {
          return 0;
        }
        if (a[sortColumn.dataIndex] === null) {
          return 1;
        }
        if (b[sortColumn.dataIndex] === null) {
          return -1;
        }

        if (a[sortColumn.dataIndex] > b[sortColumn.dataIndex]) {
          return 1; // cambia a -1 para ordenar de Z-A
        }
        if (a[sortColumn.dataIndex] < b[sortColumn.dataIndex]) {
          return -1; // cambia a 1 para ordenar de Z-A
        }
        return 0;
      });
    } else if (sortColumn.sort === 'desc') {
      membershipCopy.sort((a, b) => {
        if (a[sortColumn.dataIndex] === null && b[sortColumn.dataIndex] === null) {
          return 0;
        }
        if (a[sortColumn.dataIndex] === null) {
          return 1;
        }
        if (b[sortColumn.dataIndex] === null) {
          return -1;
        }

        if (a[sortColumn.dataIndex] > b[sortColumn.dataIndex]) {
          return -1; // cambia a -1 para ordenar de Z-A
        }
        if (a[sortColumn.dataIndex] < b[sortColumn.dataIndex]) {
          return 1; // cambia a 1 para ordenar de Z-A
        }
        return 0;
      });
    }

    setSearchParams({
      page: 1,
      size: 10,
    })
    setFiltreredMembership(membershipCopy)
    setTotalCurrentItems(membershipCopy.length)

  }, [sortColumn])

  useEffect(() => {
    if (filteredRadioGroup.dataIndex === '') {
      setFiltreredMembership(memberships)
      setSearchParams({
        page: 1,
        size: 10,
      })
      setTotalCurrentItems(total)
      return
    }

    let newMembership = []

    if (filteredRadioGroup.value === 1) {
      newMembership = memberships.filter(membership => {
        return membership[filteredRadioGroup.dataIndex] !== null
      })
    } else if (filteredRadioGroup.value === 3) {
      newMembership = memberships.filter(membership => {
        return membership[filteredRadioGroup.dataIndex] === null
      })
    } else if (filteredRadioGroup.value === 2) {

      if (filteredRadioGroup.key === '') return

      newMembership = memberships.filter(membership => {
        return membership[filteredRadioGroup.dataIndex]?.toString().toLowerCase().includes(filteredRadioGroup.key.toLowerCase())
      })
    }
    setSearchParams({
      page: 1,
      size: 10,
    })
    setFiltreredMembership(newMembership)
    setTotalCurrentItems(newMembership.length)
    console.log({ newMembership })

  }, [filteredRadioGroup])

  useEffect(() => {
    if (filteredNumber.dataIndex === '') {
      setFiltreredMembership(memberships)
      setSearchParams({
        page: 1,
        size: 10,
      })
      setTotalCurrentItems(total)
      return
    }

    let newMembership = []

    if (filteredNumber.value === 1) {
      newMembership = memberships.filter(membership => {
        return membership[filteredNumber.dataIndex] !== null
      })
    } else if (filteredNumber.value === 5) {
      newMembership = memberships.filter(membership => {
        return membership[filteredNumber.dataIndex] === null
      })
    } else if (filteredNumber.value === 2) {

      newMembership = memberships.filter(membership => {
        let number = membership[filteredNumber.dataIndex].match(/\d+/g)
        let numberPart = parseFloat(number.join(""))
        // console.log(filteredNumber.less, numberPart)
        return filteredNumber.less < numberPart
      })

      // if (filteredNumber.key === '') return

      // newMembership = memberships.filter(membership => {
      //   return membership[filteredRadioGroup.dataIndex]?.toString().toLowerCase().includes(filteredRadioGroup.key.toLowerCase())
      // })
    }
    setSearchParams({
      page: 1,
      size: 10,
    })
    setFiltreredMembership(newMembership)
    setTotalCurrentItems(newMembership.length)
    console.log({ newMembership })

  }, [filteredNumber])

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


  const containerSortButtons = useCss({
    display: 'flex'
  })

  console.log(data, "data")
  // const idx = 'IDX00915'
  // console.log(idx.split('0').slice(-1))

  useEffect(() => {
    if (memberships?.length !== 0) {
      window.scrollTo({
        top: parseInt(localStorage.getItem('scrollY002') || 0),
      })
    }
  }, [memberships?.length])
  const [currentItems, setCurrentItems] = useState([])
  const items = currentItems.length !== 0 ? currentItems : memberships
  const totalPrice = items
    ?.map(item => currency(item.price || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)
  const totalMonthly = items
    ?.map(item => currency(item.amount || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)

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
    setTotalCurrentItems(total)
    setFilteredRadioGroup({ value: 0, dataIndex: '', key: '' })
    setSearchParams({
      page: 1,
      size: 10,
    })
    // setSearchText(SEARCH_TEXT_INITIAL_STATE)
    // setSearchedColumn(SEARCHED_COLUMN_INITIAL_STATE)
    // setCurrentItems([])

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




  const launch_website_columns = [
    {
      ...getColumnProps({
        title: 'Launch W Requested',
        dataIndex: 'launch_website',
      }),
      ...getColumnSearchProps('launch_website'),
      ...getColumnSortProps('launch_website'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.request_publish_date_time}
        >
          {record.request_publish_date}
        </Tooltip>
      )
    },
    {
      title: 'Last Action',
      dataIndex: 'last_action',
      key: 'last_action',
      ...getColumnSearchProps('last_action'),
      render: (text, record) => (
        <LastActionCell
          text={text}
          isHighlighted={searchedColumn['last_action']}
          highlightedText={searchText['last_action']}
          registration_key={record.registration_key}
          membershipId={record.memberships_id}
        />
      ),
      ...getColumnSortProps('last_action'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      ...getColumnSortProps('status'),
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
    },
    {
      title: 'Membership ID',
      dataIndex: 'memberships_id',
      key: 'memberships_id',
      ...getColumnSearchProps('memberships_id'),
      ...getColumnSortProps('memberships_id'),
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
      title: 'URL',
      dataIndex: 'wordpress_install_url',
      key: 'wordpress_install_url',
      ...getColumnSearchProps('wordpress_install_url'),
      render: url => (
        <a href={url} target='_blank' rel='noreferrer'>
          <Tooltip
            placement='topLeft'
            title={
              <>
                {renderTextHighlighter({
                  text: url,
                  isHighlighted: searchedColumn['wordpress_install_url'],
                  highlightedText: searchText['wordpress_install_url'],
                })}
              </>
            }
          >
            {renderTextHighlighter({
              text: url,
              isHighlighted: searchedColumn['wordpress_install_url'],
              highlightedText: searchText['wordpress_install_url'],
            })}
          </Tooltip>
        </a>
      ),
      ...getColumnSortProps('wordpress_install_url'),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      ...getDateColumnSearchProps('created_at'),
      render: (date, record) => (
        // moment(moment(date, 'MM-DD-YYYY')).format('ll')

        <Tooltip
          placement='topLeft'
          title={record.created_at_date_time}
        >
          {moment(record.created_at).format('MMM DD, YYYY')}
        </Tooltip>

      )
      ,
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(moment(a.created_at, 'MM-DD-YYYY')).diff(
            moment(b.created_at, 'MM-DD-YYYY'),
          )
        },
      }),
    },
    {
      ...getColumnProps({
        title: 'Published',
        dataIndex: 'published',
      }),
      ...getColumnSearchProps('published'),
      ...getColumnSortProps('published'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.published}
        >
          {record.published}
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.price}
        >
          {record.price}
        </Tooltip>
      )
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 90,
      render: (text, { registration_key, id }) => (
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
                      <a
                        // href={`https://cpanel.idxboost${window.MODE}/customers/memberships/login/cpanel/${id}`}
                        href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/cpanel/${id}`}
                        target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
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
                      <a
                        // href={`https://cpanel.idxboost${window.MODE}/customers/memberships/login/wordpress/${id}`} 
                        href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/wordpress/${id}`}
                        target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
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
                  <a href>
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

              <Requesticon registration_key={registration_key} />

              <Tooltip title='ONB'>
                <a href>
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
          trigger='click'
        >
          <a href>
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

  const columns = [
    {
      title: "Last Action"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'last_action' })} >A → Z</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'last_action' })} >Z → A</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'last_action',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'last_action',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Last Action
      //   </Popover>
      // )
      ,
      dataIndex: 'last_action',
      key: 'last_action',
      ...getColumnSearchProps('last_action'),
      ...getColumnSortProps('last_action'),
      render: (text, record) => (
        <LastActionCell
          text={text}
          isHighlighted={searchedColumn['last_action']}
          highlightedText={searchText['last_action']}
          registration_key={record.registration_key}
          membershipId={record.memberships_id}
        />
      ),
      width: 150,
      fixed: 'left',
    },
    {
      title: "Status"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'status' })} >A → Z</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'status' })} >Z → A</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'status',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'status',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Status
      //   </Popover>
      // )
      ,
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      ...getColumnSortProps('status'),
      render: (text, record) => (
        <Tooltip
          title={record.status}

        >
          <p
            style={{
              whiteSpace: "pre-wrap"
            }}
          >
            {record.status}

          </p>
        </Tooltip>
      ),
      fixed: 'left',
      width: 150,
    },
    {
      title: "Membership ID"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'memberships_id' })} >A → Z</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'memberships_id' })} >Z → A</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'memberships_id',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'memberships_id',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Membership ID
      //   </Popover>
      // )
      ,
      dataIndex: 'memberships_id',
      key: 'memberships_id',
      ...getColumnSearchProps('memberships_id'),
      ...getColumnSortProps('memberships_id'),
      render: (text, record) => (
        <Tooltip
          title={record.memberships_id}
          placement='topLeft'
        >
          {record.memberships_id}
        </Tooltip>
      ),
      width: 170,
      fixed: 'left',
    },
    {
      title: "Client Name"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'client_name' })} >A → Z</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'client_name' })} >Z → A</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'client_name',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'client_name',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Client Name
      //   </Popover>
      // )
      ,
      dataIndex: 'client_name',
      key: 'client_name',
      ...getColumnSearchProps('client_name'),
      ...getColumnSortProps('client_name'),
      render: (clientName, record) => (
        <>
          <a
            href={`${window.location.origin}/customers/v2/customers#/customer-view/${record.customer_id}`}
            rel='noreferrer'
          >
            <Tooltip placement='topLeft' title={
              <>
                {renderTextHighlighter({
                  text: clientName,
                  isHighlighted: searchedColumn['client_name'],
                  highlightedText: searchText['client_name'],
                })}
              </>
            }>
              {renderTextHighlighter({
                text: clientName,
                isHighlighted: searchedColumn['client_name'],
                highlightedText: searchText['client_name'],
              })}
            </Tooltip>
          </a>
        </>
      ),
      width: 160,
      fixed: 'left',
    },
    {
      title: "Project Name"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'project_name' })} >A → Z</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'project_name' })} >Z → A</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'project_name',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'project_name',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Project Name
      //   </Popover>
      // )
      ,
      dataIndex: 'project_name',
      key: 'project_name',
      ...getColumnSearchProps('project_name'),
      ...getColumnSortProps('project_name'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.project_name}
        >
          {record.project_name}
        </Tooltip>
      ),
      width: 155,
      fixed: 'left',
    },
    {
      title: "Email"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         {/* <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortAscending('Email')} >A → Z</Button>
      //           <Button onClick={() => setSortDescending('Email')} >Z → A</Button>
      //         </div> */}
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'email',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'email',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Email
      //   </Popover>
      // )
      ,
      dataIndex: 'email',
      key: 'email',
      ...getColumnSearchProps('email'),
      ...getColumnSortProps('email'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.email}
        >
          {record.email}
        </Tooltip>
      ),
      width: 280,
    },
    {
      title: "URL"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         {/* <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortAscending('wordpress_install_url')} >A → Z</Button>
      //           <Button onClick={() => setSortDescending('wordpress_install_url')} >Z → A</Button>
      //         </div> */}
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'wordpress_install_url',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'wordpress_install_url',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     URL
      //   </Popover>
      // )
      ,
      dataIndex: 'wordpress_install_url',
      key: 'wordpress_install_url',
      ...getColumnSearchProps('wordpress_install_url'),
      ...getColumnSortProps('wordpress_install_url'),
      render: url => (
        <a href={url} target='_blank' rel='noreferrer'>
          <Tooltip placement='topLeft' title={
            <>
              {renderTextHighlighter({
                text: url,
                isHighlighted: searchedColumn['wordpress_install_url'],
                highlightedText: searchText['wordpress_install_url'],
              })}
            </>
          }>
            {renderTextHighlighter({
              text: url,
              isHighlighted: searchedColumn['wordpress_install_url'],
              highlightedText: searchText['wordpress_install_url'],
            })}
          </Tooltip>
        </a>
      ),
      width: 380,
    },
    {
      title: "Product/Service"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'class_accounting_name' })} >A → Z</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'class_accounting_name' })} >Z → A</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'class_accounting_name',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'class_accounting_name',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Product/Service
      //   </Popover>
      // )
      ,
      key: 'class_accounting_name',
      dataIndex: 'class_accounting_name',
      ...getColumnSearchProps('class_accounting_name'),
      ...getColumnSortProps('class_accounting_name'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.class_accounting_name}
        >
          {record.class_accounting_name}
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date, record) => (
        <Tooltip
          placement='topLeft'
          title={record.created_at_hour}
        >
          {moment(record.created_at).format('MMM DD, YYYY')}
        </Tooltip>
      ),
      ...getDateColumnSearchProps('created_at'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(moment(a.created_at, 'MM-DD-YYYY')).diff(
            moment(b.created_at, 'MM-DD-YYYY'),
          )
        },
      }),
      width: 120,
    },
    {
      title: "$ Price"
      // title: (text, record) => (
      //   <Popover
      //     className='titleColumn'
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'price' })} >0 → 9</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'price' })} >9 → 0</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredNumber({
      //               value: e.target.value,
      //               dataIndex: 'price',
      //               less: 0,
      //               greater: 0
      //             })
      //           }}
      //           value={filteredNumber.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               is less than
      //               {filteredNumber.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredNumber.less}
      //                   type='number'
      //                   min={0}
      //                   onChange={(e) => setFilteredNumber({
      //                     dataIndex: 'price',
      //                     value: 2,
      //                     less: parseFloat(e.target.value),
      //                     greater: 0
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>
      //               is greater than
      //               {filteredNumber.value === 3 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredNumber.greater}
      //                   min={0}
      //                   type='number'
      //                   onChange={(e) => setFilteredNumber({
      //                     dataIndex: 'price',
      //                     value: 3,
      //                     greater: e.target.value,
      //                     less: 0
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={4}>
      //               between
      //               {filteredNumber.value === 4 ? (
      //                 <>
      //                   <Input
      //                     style={{
      //                       width: 100,
      //                       marginLeft: 10,
      //                     }}
      //                     value={filteredNumber.less}
      //                     min={0}
      //                     type='number'
      //                     onChange={(e) => setFilteredNumber(previous => {
      //                       return {
      //                         ...previous,
      //                         less: e.target.value
      //                       }
      //                     })}
      //                   />
      //                   To
      //                   <Input
      //                     style={{
      //                       width: 100,
      //                       marginLeft: 10,
      //                     }}
      //                     value={filteredNumber.greater}
      //                     min={0}
      //                     type='number'
      //                     onChange={(e) => setFilteredNumber(previous => {
      //                       return {
      //                         ...previous,
      //                         greater: e.target.value
      //                       }
      //                     })}
      //                   />
      //                 </>
      //               ) : null}
      //             </Radio>
      //             <Radio value={5}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     $ Price
      //   </Popover>
      // )
      ,
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.price}
        >
          ${record.price}
        </Tooltip>
      ),
      width: 120,
    },
    {
      title: "$ Setup Fee"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'setup_fee' })} >0 → 9</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'setup_fee' })} >9 → 0</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'setup_fee',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'setup_fee',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     $ Setup Fee
      //   </Popover>
      // )
      ,
      dataIndex: 'setup_fee',
      key: 'setup_fee',
      ...getColumnSearchProps('setup_fee'),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.setup_fee}
        >
          {record.setup_fee}
        </Tooltip>
      ),
      width: 100,
    },
    {
      title: "Periods"
      // (text, record) => (
      //   <Popover
      //     placement='bottomLeft'
      //     trigger="click"
      //     content={
      //       <Space size='large' direction='vertical'>
      //         <Typography.Title level={5}>
      //           Sort
      //         </Typography.Title>
      //         <div className={containerSortButtons}>
      //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'periods' })} >0 → 9</Button>
      //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'periods' })} >9 → 0</Button>
      //         </div>
      //         <Typography.Title level={5}>
      //           Filter
      //         </Typography.Title>
      //         <Radio.Group
      //           onChange={(e) => {
      //             setFilteredRadioGroup({
      //               value: e.target.value,
      //               dataIndex: 'periods',
      //               key: ''
      //             })
      //           }}
      //           value={filteredRadioGroup.value}
      //         >
      //           <Space direction='vertical'>
      //             <Radio value={1}>is not empty</Radio>
      //             <Radio value={2}>
      //               contains
      //               {filteredRadioGroup.value === 2 ? (
      //                 <Input
      //                   style={{
      //                     width: 100,
      //                     marginLeft: 10,
      //                   }}
      //                   value={filteredRadioGroup.key}
      //                   onChange={(e) => setFilteredRadioGroup({
      //                     dataIndex: 'periods',
      //                     key: e.target.value,
      //                     value: 2
      //                   })}
      //                 />
      //               ) : null}
      //             </Radio>
      //             <Radio value={3}>is empty</Radio>
      //           </Space>
      //         </Radio.Group>
      //       </Space>
      //     }
      //   >
      //     Periods
      //   </Popover>
      // )
      ,
      dataIndex: 'periods',
      key: 'periods',
      ...getColumnSearchProps('periods'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return parseFloat(a.periods || 0) - parseFloat(b.periods || 0)
        },
      }),
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.periods}
        >
          {record.periods}
        </Tooltip>
      ),
      width: 120,
    },
    // {
    //   title: "$ Lifetime"
    //   // (text, record) => (
    //   //   <Popover
    //   //     placement='bottomLeft'
    //   //     trigger="click"
    //   //     content={
    //   //       <Space size='large' direction='vertical'>
    //   //         <Typography.Title level={5}>
    //   //           Sort
    //   //         </Typography.Title>
    //   //         <div className={containerSortButtons}>
    //   //           <Button onClick={() => setSortColumn({ sort: 'asc', dataIndex: 'amount' })} >0 → 9</Button>
    //   //           <Button onClick={() => setSortColumn({ sort: 'desc', dataIndex: 'amount' })} >9 → 0</Button>
    //   //         </div>
    //   //         <Typography.Title level={5}>
    //   //           Filter
    //   //         </Typography.Title>
    //   //         <Radio.Group
    //   //           onChange={(e) => {
    //   //             setFilteredRadioGroup({
    //   //               value: e.target.value,
    //   //               dataIndex: 'amount',
    //   //               key: ''
    //   //             })
    //   //           }}
    //   //           value={filteredRadioGroup.value}
    //   //         >
    //   //           <Space direction='vertical'>
    //   //             <Radio value={1}>is not empty</Radio>
    //   //             <Radio value={2}>
    //   //               contains
    //   //               {filteredRadioGroup.value === 2 ? (
    //   //                 <Input
    //   //                   style={{
    //   //                     width: 100,
    //   //                     marginLeft: 10,
    //   //                   }}
    //   //                   value={filteredRadioGroup.key}
    //   //                   onChange={(e) => setFilteredRadioGroup({
    //   //                     dataIndex: 'amount',
    //   //                     key: e.target.value,
    //   //                     value: 2
    //   //                   })}
    //   //                 />
    //   //               ) : null}
    //   //             </Radio>
    //   //             <Radio value={3}>is empty</Radio>
    //   //           </Space>
    //   //         </Radio.Group>
    //   //       </Space>
    //   //     }
    //   //   >
    //   //     $ Lifetime
    //   //   </Popover>
    //   // )
    //   ,
    //   dataIndex: 'amount',
    //   key: 'amount',
    //   ...getColumnSearchProps('amount'),
    //   ...getCustomColumnSortProps({
    //     sorter: (a, b) => {
    //       return (
    //         parseFloat(currency(a.amount).value) -
    //         parseFloat(currency(b.amount).value)
    //       )
    //     },
    //   }),
    //   render: (text, record) => (
    //     <Tooltip
    //       placement='topLeft'
    //       title={record.amount}
    //     >
    //       {record.amount}
    //     </Tooltip>
    //   ),
    //   width: 130,
    // },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: 85,
      render: (text, { registration_key, id, cycle_billing_type }) => (
        <Popover
          placement='bottom'
          trigger='hover'
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

              {
                !cycle_billing_type && (
                  <BillingEnrollment registration_key={registration_key} />
                )
              }

              <Deleteicon registration_key={registration_key} />


              {/* eslint-enable jsx-a11y/anchor-is-valid */}
            </Space>
          }

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
  const idx_requested_columns = [
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
      render: (text, record) => (
        <Tooltip
          placement='topLeft'
          title={record.idx_requested_date_hour}
        >
          {record.idx_requested_date}
        </Tooltip>
      ),
      width: 160,
      fixed: 'left',
    },
    ...columns,
  ]
  const getColumns = filter => {
    switch (filter) {
      case 'idx_requested':
        return idx_requested_columns
      case 'launch_website':
        return launch_website_columns
      default:
        return columns
    }
  }

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
            Monthly:{' '}
            {typeof totalPrice === 'number' ? (
              USD(totalPrice, { precision: 2 })
            ) : (
              <DollarOutlined spin />
            )}
          </Typography.Title>
          {/* <Typography.Title level={5} style={{ margin: 0 }}>
            $ Lifetime:{' '}
            {typeof totalMonthly === 'number' ? (
              USD(totalMonthly, { precision: 2 })
            ) : (
              <DollarOutlined spin />
            )}
          </Typography.Title> */}
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
      {
        (filter === "launch_website") && (
          <Typography.Title level={5} style={{ margin: 0 }}>
            We gonna show the last 30 days launch websites
          </Typography.Title>)
      }
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
        columns={getColumns(filter)}
        dataSource={filtreredMembership}
        bordered
        loading={isLoading}
        onChange={handleChange}
        pagination={{
          total: totalCurrentItems || total,
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
        scroll={{ x: '100%' }}
      />
    </div>
  )
}
