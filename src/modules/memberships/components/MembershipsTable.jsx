import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react"
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Modal,
  Popover,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd"
import { DollarOutlined, SearchOutlined } from "@ant-design/icons"
import {
  capitalize,
  getColumnProps,
  getConfig,
  renderTextHighlighter,
  showTotal,
  USD,
} from "../../../helpers"
import moment from "moment/moment"
import { useGetAllMembershipsQuery } from "../../../app/api/backoffice"
import currency from "currency.js"
import {
  LastActionCell,
  EditMemberhipIcon,
  Requesticon,
  Deleteicon,
  BillingEnrollment,
  Actions,
} from "."
import numbro from "numbro"
import { useSearchParams } from "react-router-dom"
import { useEvent } from "react-use"
import "../../../icons/style.css"

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

export const MembershipsTable = ({ filter = "" }) => {
  let [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    size: 10,
  })
  const userId = getConfig().userId

  const [filtreredMembership, setFiltreredMembership] = useState([])
  const [filtredValue, setFiltredValue] = useState("")
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [filterUsers, setFilterUsers] = useState([])
  const [arrayUsersId, setArrayUsersId] = useState([])
  const [usersFiltered, setUsersFiltered] = useState([])

  const [currentRegKey, setCurrentRegKey] = useState("")
  const [billingCicle, setBillingCicle] = useState(1)
  const [currentId, setCurrentId] = useState("")
  const [currenMembershipID, setCurrenMembershipID] = useState("")
  const handleClickModalActions = (
    regkey,
    id,
    cycle_billing_type,
    memberships_id
  ) => {
    setCurrentRegKey(regkey)
    setBillingCicle(cycle_billing_type)
    setCurrentId(id)
    setCurrenMembershipID(memberships_id)
    handleOpen()
  }
  // const [filteredValueColumn, setFilteredValueColumn] = useState({ value: '', dataIndex: '' })
  // const [sortAscending, setSortAscending] = useState('')
  // const [sortDescending, setSortDescending] = useState('')
  const [sortColumn, setSortColumn] = useState({ sort: "", dataIndex: "" })
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size")))
  const [page, setPage] = useState(parseInt(searchParams.get("page")))
  const onScroll = useCallback(() => {
    localStorage.setItem("scrollY002", window.scrollY.toString())
  }, [])

  const [filteredRadioGroup, setFilteredRadioGroup] = useState({
    value: 0,
    dataIndex: "",
    key: "",
  })
  const [filteredNumber, setFilteredNumber] = useState({
    less: 0,
    greater: 0,
    dataIndex: "",
    value: "",
  })
  const getRepeatedValues = (filterUsersName, users) => {
    const repeatedValues = []

    for (const name of filterUsersName) {
      const user = users.find((user) => user.label === name)
      if (user) {
        repeatedValues.push(user.value)
      }
    }

    return repeatedValues
  }
  useEvent("scroll", onScroll)

  const [totalCurrentItems, setTotalCurrentItems] = useState()
  const { data = {}, isLoading } = useGetAllMembershipsQuery({
    filter,
    users: arrayUsersId,
    userId,
  })
  const {
    data: memberships = [],
    total = 0,
    users = [],
    billingEnrollment = 0,
    addPayment = 0,
  } = data

  useEffect(() => {
    setUsersFiltered(
      users.map(({ label }) => {
        return {
          label,
          value: label,
        }
      })
    )
  }, [users?.length])

  useEffect(() => {
    const usersId = getRepeatedValues(filterUsers, users)
    setArrayUsersId(usersId)
    // setFiltredValue((e) => e)
  }, [filterUsers.length])

  console.log({ data })

  useEffect(() => {
    // if (memberships?.length > 0) {
    setFiltreredMembership(memberships)
    setSearchParams({
      page: 1,
      size: 10,
    })
    setTotalCurrentItems(total)
    // }
  }, [memberships?.length])

  useEffect(() => {
    if (sortColumn.dataIndex === "") {
      setSearchParams({
        page: 1,
        size: 10,
      })
      setFiltreredMembership(memberships)
      setTotalCurrentItems(total)
      return
    }
    const membershipCopy = [...memberships]

    if (sortColumn.sort === "asc") {
      membershipCopy.sort((a, b) => {
        if (
          a[sortColumn.dataIndex] === null &&
          b[sortColumn.dataIndex] === null
        ) {
          return 0
        }
        if (a[sortColumn.dataIndex] === null) {
          return 1
        }
        if (b[sortColumn.dataIndex] === null) {
          return -1
        }

        if (a[sortColumn.dataIndex] > b[sortColumn.dataIndex]) {
          return 1 // cambia a -1 para ordenar de Z-A
        }
        if (a[sortColumn.dataIndex] < b[sortColumn.dataIndex]) {
          return -1 // cambia a 1 para ordenar de Z-A
        }
        return 0
      })
    } else if (sortColumn.sort === "desc") {
      membershipCopy.sort((a, b) => {
        if (
          a[sortColumn.dataIndex] === null &&
          b[sortColumn.dataIndex] === null
        ) {
          return 0
        }
        if (a[sortColumn.dataIndex] === null) {
          return 1
        }
        if (b[sortColumn.dataIndex] === null) {
          return -1
        }

        if (a[sortColumn.dataIndex] > b[sortColumn.dataIndex]) {
          return -1 // cambia a -1 para ordenar de Z-A
        }
        if (a[sortColumn.dataIndex] < b[sortColumn.dataIndex]) {
          return 1 // cambia a 1 para ordenar de Z-A
        }
        return 0
      })
    }

    setSearchParams({
      page: 1,
      size: 10,
    })
    setFiltreredMembership(membershipCopy)
    setTotalCurrentItems(membershipCopy.length)
  }, [sortColumn])

  useEffect(() => {
    if (filteredRadioGroup.dataIndex === "") {
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
      newMembership = memberships.filter((membership) => {
        return membership[filteredRadioGroup.dataIndex] !== null
      })
    } else if (filteredRadioGroup.value === 3) {
      newMembership = memberships.filter((membership) => {
        return membership[filteredRadioGroup.dataIndex] === null
      })
    } else if (filteredRadioGroup.value === 2) {
      if (filteredRadioGroup.key === "") return
      newMembership = memberships.filter((membership) => {
        return membership[filteredRadioGroup.dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(filteredRadioGroup.key.toLowerCase())
      })
    }
    setSearchParams({
      page: 1,
      size: 10,
    })
    setFiltreredMembership(newMembership)
    setTotalCurrentItems(newMembership.length)
  }, [filteredRadioGroup])

  useEffect(() => {
    if (filteredNumber.dataIndex === "") {
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
      newMembership = memberships.filter((membership) => {
        return membership[filteredNumber.dataIndex] !== null
      })
    } else if (filteredNumber.value === 5) {
      newMembership = memberships.filter((membership) => {
        return membership[filteredNumber.dataIndex] === null
      })
    } else if (filteredNumber.value === 2) {
      newMembership = memberships.filter((membership) => {
        let number = membership[filteredNumber.dataIndex].match(/\d+/g)
        let numberPart = parseFloat(number.join(""))
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
  }, [filteredNumber])

  useEffect(() => {
    if (filtredValue === "") {
      setFiltreredMembership(memberships)
      setSearchParams({
        page: 1,
        size: 10,
      })
      setTotalCurrentItems(total)
      return
    }
    const newMembership = memberships.filter((membership) => {
      return (
        membership.registration_key
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.memberships_id
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.client_name
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.project_name
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.email
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.wordpress_install_url
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase())
      )
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
      window.scrollTo({
        top: parseInt(localStorage.getItem("scrollY002") || 0),
      })
    }
  }, [memberships?.length])
  const [currentItems, setCurrentItems] = useState([])
  const items = currentItems.length !== 0 ? currentItems : memberships
  const totalPrice = items
    ?.map((item) => currency(item.price || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)
  const totalMonthly = items
    ?.map((item) => currency(item.amount || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)

  const [tableKey, setTableKey] = useState(0)
  const [searchText, setSearchText] = useReducer(
    reducer,
    SEARCH_TEXT_INITIAL_STATE
  )
  const [searchedColumn, setSearchedColumn] = useReducer(
    reducer,
    SEARCHED_COLUMN_INITIAL_STATE
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
    setSearchText({ [dataIndex]: "" })
  }
  const handleSearch2 = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText({ [dataIndex[0]]: selectedKeys[0] })
    setSearchedColumn({ [dataIndex[0]]: true })
  }
  const handleReset2 = (clearFilters, confirm, dataIndex) => {
    clearFilters()
    confirm({ closeDropdown: true })
    setSearchedColumn({ [dataIndex[0]]: false })
    setSearchText({ [dataIndex[0]]: "" })
  }
  const resetFilters = () => {
    setTableKey((tableKey) => tableKey + 1)
    setTotalCurrentItems(total)
    setFilteredRadioGroup({ value: 0, dataIndex: "", key: "" })
    setSearchParams({
      page: 1,
      size: 10,
    })
    setFilterUsers([])
    // setSearchText(SEARCH_TEXT_INITIAL_STATE)
    // setSearchedColumn(SEARCHED_COLUMN_INITIAL_STATE)
    // setCurrentItems([])
  }

  const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
    setTotalCurrentItems(currentDataSource?.length)
    setCurrentItems(currentDataSource)
  }

  const getDateColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{ padding: 8, display: "flex", flexDirection: "column", gap: 8 }}
      >
        <DatePicker
          value={selectedKeys[0]}
          onChange={(e) => {
            console.log(e.format("DD-MM-YYYY"))
            setSelectedKeys([e])
          }}
          allowClear={true}
          style={{ width: "100%" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) => {
      return (
        moment(moment(record[dataIndex])).format("DD-MM-YYYY") ===
        value.format("DD-MM-YYYY")
      )
    },
  })
  const getColumnSearchProps = (dataIndex) => ({
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
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch2(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch2(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() =>
              clearFilters && handleReset2(clearFilters, confirm, dataIndex)
            }
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      const searchString = value.toLowerCase()
      return dataIndex.some((data) => {
        const text = record[data] || ""
        return text.toString().toLowerCase().includes(searchString)
      })
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text = "", record) => {
      const concatenatedText = dataIndex
        .map((data) => record[data] || "")
        .join(" ")
      return concatenatedText
    },
  })

  const getColumnSortProps = (dataIndex) => {
    return {
      sorter: (a, b) => {
        return (a[dataIndex] || "").localeCompare(b[dataIndex] || "")
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
        title: "Launch W Requested",
        dataIndex: "request_publish_date",
      }),
      ...getDateColumnSearchProps("request_publish_date"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.request_publish_date || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(
            moment(b.request_publish_date || "Jan 01, 1970", "MMM DD, YYYY")
          )
        },
      }),
      defaultSortOrder: "descend",
      // ...getDateColumnSearchProps('request_publish_date'),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.request_publish_date_time}>
          {record.request_publish_date}
        </Tooltip>
      ),
    },
    {
      title: "Membership ID",
      dataIndex: "memberships_id",
      key: "memberships_id",
      ...getColumnSearchProps(["memberships_id"]),
      ...getColumnSortProps("memberships_id"),
      render: (text, record) => (
        <a
          href={`${window.location.origin}/customers/v2/customers#/membership-details/${record.registration_key}`}
          rel="noreferrer"
        >
          <Tooltip placement="topLeft" title={record.memberships_id}>
            {record.memberships_id}
          </Tooltip>
        </a>
      ),
    },
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
      ...getColumnSearchProps(["client_name"]),
      render: (clientName, record) => (
        <a
          href={`${window.location.origin}/customers/v2/customers#/customer-view/${record.customer_id}`}
          rel="noreferrer"
        >
          <Tooltip
            placement="topLeft"
            title={
              <>
                {renderTextHighlighter({
                  text: clientName,
                  isHighlighted: searchedColumn["client_name"],
                  highlightedText: searchText["client_name"],
                })}
              </>
            }
          >
            {renderTextHighlighter({
              text: clientName,
              isHighlighted: searchedColumn["client_name"],
              highlightedText: searchText["client_name"],
            })}
          </Tooltip>
        </a>
      ),
      ...getColumnSortProps("client_name"),
    },
    {
      title: "Product/Service",
      key: "class_accounting_name",
      dataIndex: "class_accounting_name",
      ...getColumnSearchProps(["class_accounting_name"]),
      ...getColumnSortProps("class_accounting_name"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.class_accounting_name}>
          {record.class_accounting_name}
        </Tooltip>
      ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      ...getDateColumnSearchProps("created_at"),
      render: (date, record) => (
        // moment(moment(date, 'MM-DD-YYYY')).format('ll')

        <Tooltip placement="topLeft" title={record.created_at_date_time}>
          {moment(record.created_at).format("MMM DD, YYYY")}
        </Tooltip>
      ),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.created_at || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.created_at || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
    },
    {
      title: "Last Action",
      dataIndex: "last_action",
      key: "last_action",
      ...getColumnSearchProps(["last_action"]),
      render: (text, record) => (
        <LastActionCell
          text={text}
          date={record.last_action_date}
          isHighlighted={searchedColumn["last_action"]}
          highlightedText={searchText["last_action"]}
          registration_key={record.registration_key}
          membershipId={record.memberships_id}
        />
      ),
      ...getColumnSortProps("last_action"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps(["email"]),
      ...getColumnSortProps("email"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.email}>
          {record.email}
        </Tooltip>
      ),
      width: 250,
    },
    {
      title: "URL",
      dataIndex: "wordpress_install_url",
      key: "wordpress_install_url",
      ...getColumnSearchProps(["wordpress_install_url"]),
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer">
          <Tooltip
            placement="topLeft"
            title={
              <>
                {renderTextHighlighter({
                  text: url,
                  isHighlighted: searchedColumn["wordpress_install_url"],
                  highlightedText: searchText["wordpress_install_url"],
                })}
              </>
            }
          >
            {renderTextHighlighter({
              text: url,
              isHighlighted: searchedColumn["wordpress_install_url"],
              highlightedText: searchText["wordpress_install_url"],
            })}
          </Tooltip>
        </a>
      ),
      ...getColumnSortProps("wordpress_install_url"),
      width: 250,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps(["status"]),
      ...getColumnSortProps("status"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.status}>
          {record.status}
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      render: (
        text,
        { registration_key, id, cycle_billing_type, memberships_id }
      ) => (
        <Button
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#858faf",
            fontSize: "10px",
            border: "none",
            backgroundColor: "transparent",
          }}
          onClick={() =>
            handleClickModalActions(
              registration_key,
              id,
              cycle_billing_type,
              memberships_id
            )
          }
        >
          <span
            className="back-office-tools"
            style={{ fontSize: "30px" }}
          ></span>
          TOOLBOX
        </Button>
      ),
    },
  ]

  const columns = [
    {
      title: "Membership ID",
      dataIndex: "memberships_id",
      key: "memberships_id",
      ...getColumnSearchProps(["memberships_id"]),
      ...getColumnSortProps("memberships_id"),
      render: (text, record) => (
        <a
          href={`${window.location.origin}/customers/v2/customers#/membership-details/${record.registration_key}`}
          rel="noreferrer"
        >
          <Tooltip title={record.memberships_id} placement="topLeft">
            {record.memberships_id}
          </Tooltip>
        </a>
      ),
      width: 170,
      fixed: "left",
    },
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
      ...getColumnSearchProps(["client_name", "project_name"]),
      ...getColumnSortProps("client_name"),
      render: (clientName, record) => (
        <>
          <a
            href={`${window.location.origin}/customers/v2/customers#/customer-view/${record.customer_id}`}
            rel="noreferrer"
          >
            <Tooltip placement="topLeft" title={clientName}>
              {clientName}
              <br />
              {record.project_name}
            </Tooltip>
          </a>
        </>
      ),
      width: 160,
      fixed: "left",
    },
    {
      title: "Product/Service",
      key: "class_accounting_name",
      dataIndex: "class_accounting_name",
      ...getColumnSearchProps(["class_accounting_name"]),
      ...getColumnSortProps("class_accounting_name"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.class_accounting_name}>
          {record.class_accounting_name}
        </Tooltip>
      ),
      width: 180,
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date, record) => (
        <Tooltip placement="topLeft" title={record.created_at_hour}>
          {moment(record.created_at).format("MMM DD, YYYY")}
        </Tooltip>
      ),
      ...getDateColumnSearchProps("created_at"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.created_at || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.created_at || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      width: 120,
    },
    {
      title: "Last Action",
      dataIndex: "last_action",
      key: "last_action",
      ...getColumnSearchProps(["last_action"]),
      ...getColumnSortProps("last_action"),
      render: (text, record) => (
        <LastActionCell
          text={text}
          date={record.last_action_date}
          isHighlighted={searchedColumn["last_action"]}
          highlightedText={searchText["last_action"]}
          registration_key={record.registration_key}
          membershipId={record.memberships_id}
        />
      ),
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps(["email"]),
      ...getColumnSortProps("email"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.email}>
          {record.email}
        </Tooltip>
      ),
      width: 280,
    },
    {
      title: "URL",
      dataIndex: "wordpress_install_url",
      key: "wordpress_install_url",
      ...getColumnSearchProps(["wordpress_install_url"]),
      ...getColumnSortProps("wordpress_install_url"),
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer">
          <Tooltip
            placement="topLeft"
            title={
              <>
                {renderTextHighlighter({
                  text: url,
                  isHighlighted: searchedColumn["wordpress_install_url"],
                  highlightedText: searchText["wordpress_install_url"],
                })}
              </>
            }
          >
            {renderTextHighlighter({
              text: url,
              isHighlighted: searchedColumn["wordpress_install_url"],
              highlightedText: searchText["wordpress_install_url"],
            })}
          </Tooltip>
        </a>
      ),
      width: 380,
    },
    {
      title: "Board",
      dataIndex: "board_name",
      key: "board_name",
      ...getColumnSearchProps(["board_name"]),
      ...getColumnSortProps("board_name"),
      width: 120,
      render: (date, record) => (
        <Tooltip placement="topLeft" title={record.board_name}>
          {record.board_name}
        </Tooltip>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps(["status"]),
      ...getColumnSortProps("status"),
      render: (text, record) => (
        <Tooltip title={record.status}>
          <p
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {record.status}
          </p>
        </Tooltip>
      ),
      width: 150,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      width: 100,
      render: (
        text,
        { registration_key, id, cycle_billing_type, memberships_id }
      ) => (
        <Button
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "#858faf",
            fontSize: "10px",
            border: "none",
            backgroundColor: "transparent",
          }}
          onClick={() =>
            handleClickModalActions(
              registration_key,
              id,
              cycle_billing_type,
              memberships_id
            )
          }
        >
          <span
            className="back-office-tools"
            style={{ fontSize: "30px" }}
          ></span>
          TOOLBOX
        </Button>
      ),
      fixed: "right",
    },
  ]
  const columnsWithoutBoard = columns.filter(({ title }) => title !== "Board")
  const idx_requested_columns = [
    {
      title: "IDX Requested",
      key: "idx_requested_date",
      dataIndex: "idx_requested_date",
      ...getDateColumnSearchProps("idx_requested_date"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.idx_requested_date || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.idx_requested_date || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.idx_requested_date_hour}>
          {record.idx_requested_date}
        </Tooltip>
      ),
      width: 160,
      // fixed: "left",
      defaultSortOrder: "descend",
    },
    ...columnsWithoutBoard,
  ]
  const columnsStatusBoard = columns.filter(
    ({ title }) => title !== "Board" && title !== "Status"
  )
  const payments_due_columns = [
    {
      title: "Balance Due",
      key: "balance_due",
      dataIndex: "balance_due",
      ...getDateColumnSearchProps("balance_due"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.balance_due || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.balance_due || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.balance_due}>
          {record.balance_due}
        </Tooltip>
      ),
      width: 160,
      fixed: "left",
      // defaultSortOrder: "descend",
    },
    {
      title: "Last Payment Date",
      key: "last_payment_date",
      dataIndex: "last_payment_date",
      ...getDateColumnSearchProps("last_payment_date"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.last_payment_date || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.last_payment_date || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.last_payment_date}>
          {record.last_payment_date}
        </Tooltip>
      ),
      width: 160,
      fixed: "left",
      // defaultSortOrder: "descend",
    },
    {
      title: "Next Payment Date",
      key: "next_payment_date",
      dataIndex: "next_payment_date",
      ...getDateColumnSearchProps("next_payment_date"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.next_payment_date || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.next_payment_date || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.next_payment_date}>
          {record.next_payment_date}
        </Tooltip>
      ),
      width: 160,
      fixed: "left",
      // defaultSortOrder: "descend",
    },
    ...columnsStatusBoard,
  ]
  const getColumns = (filter) => {
    switch (filter) {
      case "idx_requested":
        return idx_requested_columns
      case "payments_due":
        return payments_due_columns
      case "launch_website":
        return launch_website_columns
      default:
        return columns
    }
  }
  return (
    <div
      style={{
        padding: 8,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "baseline",
            gap: "32px",
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Memberships{" "}
            {filter
              ? filter
                  .split("_")
                  .map((word) => capitalize(word))
                  .join(" ")
              : "Active"}{" "}
            ({numbro(total).format({ thousandSeparated: true }) ?? "..."})
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Monthly:{" "}
            {typeof totalPrice === "number" ? (
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
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography.Title level={5}>Users:</Typography.Title>
          <Select
            disabled={!memberships}
            mode="multiple"
            value={filterUsers}
            options={usersFiltered}
            onChange={(e) => setFilterUsers(e)}
            // onSearch={(value) => setFiltredValue(value)}
            // size="large"
            style={{
              width: "300px",
              marginLeft: "15px",
            }}
            maxTagCount="responsive"
          />
          <Typography.Title level={5}>Search:</Typography.Title>
          <Input.Search
            disabled={!memberships}
            onSearch={(value) => setFiltredValue(value)}
            value={filtredValue}
            onChange={(e) => setFiltredValue(e.target.value)}
            size="large"
            style={{
              width: "300px",
              marginLeft: "15px",
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
      {filter === "launch_website" && (
        <Typography.Title level={5} style={{ margin: 0 }}>
          We gonna show the last 30 days launch websites
        </Typography.Title>
      )}
      <Divider dashed />
      <Button
        type="default"
        style={{ marginBottom: 8, marginLeft: "auto" }}
        onClick={resetFilters}
      >
        Reset
      </Button>
      <Table
        className="mainTable"
        key={tableKey}
        rowKey="id"
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
        scroll={{ x: "100%" }}
      />
      <Actions
        open={open}
        handleClose={handleClose}
        currentId={currentId}
        currentRegKey={currentRegKey}
        billingCicle={billingCicle}
        membershipID={currenMembershipID}
        billingEnrollment={billingEnrollment}
        addPayment={addPayment}
      />
    </div>
  )
}
