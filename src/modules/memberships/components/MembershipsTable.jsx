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
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd"
import { SearchOutlined } from "@ant-design/icons"
import {
  getColumnProps,
  renderTextHighlighter,
  showTotal,
} from "../../../helpers"
import moment from "moment/moment"
import currency from "currency.js"
import { LastActionCell } from "."
import { useSearchParams } from "react-router-dom"
import { useEvent } from "react-use"
import "../../../icons/style.css"
import { useGetListAbandonedCardQuery } from "../../../app/api/billing"
import numbro from "numbro"

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
  // const userId = getConfig().userId

  const [filtreredMembership, setFiltreredMembership] = useState([])
  const [filtredValue, setFiltredValue] = useState("")

  const [sortColumn, setSortColumn] = useState({ sort: "", dataIndex: "" })
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get("size")))
  const [page, setPage] = useState(parseInt(searchParams.get("page")))
  const onScroll = useCallback(() => {
    localStorage.setItem("scrollY002", window.scrollY.toString())
  }, [])

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
  const { data: dataAbandoned = {}, isLoading } = useGetListAbandonedCardQuery()
  const { data = [], total = 0 } = dataAbandoned
  console.log({ data })

  useEffect(() => {
    setFiltreredMembership(data)
    setSearchParams({
      page: 1,
      size: 10,
    })
  }, [data?.length])

  useEffect(() => {
    if (sortColumn.dataIndex === "") {
      setSearchParams({
        page: 1,
        size: 10,
      })
      setFiltreredMembership(data)
      setTotalCurrentItems(data.length)
      return
    }
    const membershipCopy = [...data]

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
    if (filtredValue === "") {
      setFiltreredMembership(data)
      setSearchParams({
        page: 1,
        size: 10,
      })
      setTotalCurrentItems(data.length)
      return
    }
    const newMembership = data.filter((membership) => {
      return (
        membership.client_name
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.client_phone
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.client_email
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.program_name
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.country
          ?.toString()
          .toLowerCase()
          .includes(filtredValue.toLowerCase()) ||
        membership.city
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
    if (data?.length !== 0) {
      window.scrollTo({
        top: parseInt(localStorage.getItem("scrollY002") || 0),
      })
    }
  }, [data?.length])
  const [currentItems, setCurrentItems] = useState([])
  const items = currentItems.length !== 0 ? currentItems : data
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
    // setTotalCurrentItems(total)
    setSearchParams({
      page: 1,
      size: 10,
    })
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

  const columns = [
    {
      title: "Date",
      dataIndex: "create_at",
      key: "create_at",
      ...getDateColumnSearchProps("create_at"),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.create_at || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.create_at || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      render: (date, record) => (
        <LastActionCell
          date={record.create_at}
          status_email={record.status_email}
          status_fub={record.status_fub}
          client_name={record.client_name}
        />
      ),
      defaultSortOrder: "descend",
    },
    {
      title: "Client Name",
      dataIndex: "client_name",
      key: "client_name",
      ...getColumnSearchProps(["client_name"]),
      ...getColumnSortProps("client_name"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.client_name}>
          {record.client_name}
        </Tooltip>
      ),
    },
    {
      title: "Phone",
      dataIndex: "client_phone",
      key: "client_phone",
      ...getColumnSearchProps(["client_phone"]),
      ...getColumnSortProps("client_phone"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.client_phone}>
          {record.client_phone}
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "client_email",
      key: "client_email",
      ...getColumnSearchProps(["client_email"]),
      ...getColumnSortProps("client_email"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.client_email}>
          {record.client_email}
        </Tooltip>
      ),
    },
    {
      title: "Product of Interest",
      dataIndex: "program_name",
      key: "program_name",
      ...getColumnSearchProps(["program_name"]),
      ...getColumnSortProps("program_name"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.program_name}>
          {record.program_name}
        </Tooltip>
      ),
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      ...getColumnSearchProps(["country"]),
      ...getColumnSortProps("country"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.country}>
          {record.country}
        </Tooltip>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      ...getColumnSearchProps(["city"]),
      ...getColumnSortProps("city"),
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.city}>
          {record.city}
        </Tooltip>
      ),
    },
  ]

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
            Abandoned Carts (
            {numbro(total).format({ thousandSeparated: true }) ?? "..."})
          </Typography.Title>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography.Title level={5} style={{ marginLeft: "5px" }}>
            Search:
          </Typography.Title>
          <Input.Search
            disabled={!data}
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
      </div>
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
        columns={columns}
        dataSource={filtreredMembership}
        bordered
        loading={isLoading}
        onChange={handleChange}
        pagination={{
          total: totalCurrentItems || data.length,
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
    </div>
  )
}
