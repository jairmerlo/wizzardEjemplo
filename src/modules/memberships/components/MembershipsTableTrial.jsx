import React, { useEffect, useReducer, useRef, useState } from "react"
import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Input,
  Popover,
  Radio,
  Select,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd"
import { DollarOutlined, SearchOutlined } from "@ant-design/icons"
import {
  getDateColumnSearchProps as getDateColumnSearchPropsExport,
  getColumnSortProps as getColumnSortPropsExport,
} from "../../../helpers"
import {
  renderTextHighlighter,
  showTotal,
  stringFallback,
  USD,
} from "../../../helpers"
import moment from "moment/moment"
import { useGetAllMembershipsQuery } from "../../../app/api/backoffice"
import currency from "currency.js"
import { useScroll } from "../../../hooks/useScroll"
import { useSelectedRow } from "../../../hooks/useSelectedRow"
import { useSearchParams } from "react-router-dom"
import { Actions, Deleteicon, EditMemberhipIcon, Requesticon } from "."

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

export const MembershipsTableTrial = ({ filter = "trial" }) => {
  let [searchParams, setSearchParams] = useSearchParams({
    page: 1,
    size: 10,
  })
  const pageSize = parseInt(searchParams.get("size"))
  const page = parseInt(searchParams.get("page"))
  const [radioBoxFIltred, setradioBoxFIltred] = useState("trial_on_going")
  const [currenMembershipID, setCurrenMembershipID] = useState("")

  const [filterUsers, setFilterUsers] = useState([])
  const [arrayUsersId, setArrayUsersId] = useState([])
  const [usersFiltered, setUsersFiltered] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [currentRegKey, setCurrentRegKey] = useState("")
  const [billingCicle, setBillingCicle] = useState(1)
  const [currentId, setCurrentId] = useState("")
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

  const [totalCurrentItems, setTotalCurrentItems] = useState()
  const { data = {}, isLoading } = useGetAllMembershipsQuery({
    filter: radioBoxFIltred,
    users: arrayUsersId,
  })
  const {
    data: memberships,
    total = 0,
    users = [],
    billingEnrollment = 0,
    addPayment = 0,
  } = data
  const [currentItems, setCurrentItems] = useState([])
  const items = currentItems.length !== 0 ? currentItems : memberships
  const totalPrice = items
    ?.map((item) => currency(item.price || 0).value ?? 0)
    .reduce((a, b) => a + b, 0)
  console.log({ memberships })

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
    setSearchText({ [dataIndex]: selectedKeys[0] })
    setSearchedColumn({ [dataIndex[0]]: true })
  }
  const handleReset2 = (clearFilters, confirm, dataIndex) => {
    clearFilters()
    confirm({ closeDropdown: true })
    setSearchedColumn({ [dataIndex[0]]: false })
    setSearchText({ [dataIndex[0]]: "" })
  }

  const handleChange = (pagination, filters, sorter, { currentDataSource }) => {
    // console.log('Various parameters', pagination, filters, sorter)
    setTotalCurrentItems(currentDataSource?.length)
    setCurrentItems(currentDataSource)
  }
  const { saveSelectedRow, selectedRow } = useSelectedRow()
  const { initialScrollY } = useScroll("scrollY003")

  const [filtreredMembership, setFiltreredMembership] = useState([])
  const [filtredValue, setFiltredValue] = useState("")

  const resetFilters = () => {
    setTableKey((tableKey) => tableKey + 1)
    setTotalCurrentItems(total)
    setFiltredValue("")
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

  useEffect(() => {
    setFiltreredMembership(memberships)
    setSearchParams({
      page: 1,
      size: 10,
    })
    setTotalCurrentItems(total)
    // if (memberships?.length > 0) {
    // }
  }, [memberships?.length])

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
      window.scrollTo({ top: initialScrollY })
    }
  }, [memberships?.length])

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
      console.log(moment(moment(record[dataIndex])).format("DD-MM-YYYY"))
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
          placeholder={`Search ${dataIndex}`}
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
      return { concatenatedText }
    },
  })

  const getColumnSortProps = (dataIndex, opts) => {
    return {
      sorter: (a, b) => {
        return (a[dataIndex] || "").localeCompare(b[dataIndex] || "")
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
      title: () =>
        radioBoxFIltred === "trial_on_going" ? "Trial Due" : "Ending Date",
      key: "trial_due",
      dataIndex: "trial_due",
      ...getDateColumnSearchPropsExport({
        dataIndex: "trial_due",
        onSearch: handleSearch,
        onReset: handleReset,
        initialFormat: "YYYY-MM-DD",
        finalFormat: "YYYY-MM-DD",
      }),
      render: (date, record) =>
        radioBoxFIltred !== "trial_on_going" ? (
          <Tooltip
            placement="topLeft"
            title={
              <>
                Trial Date: {record.created_at_date_time}
                <br />
                Ending Date: {record.ending_date_trial}
              </>
            }
          >
            <span style={{ color: "red" }}>{record.ending_date_trial}</span>
          </Tooltip>
        ) : date ? (
          moment(moment(date, "YYYY-MM-DD")).isSameOrAfter(moment()) ? (
            <Tooltip
              placement="topLeft"
              title={
                <>
                  Trial Date: {record.created_at_date_time}
                  <br />
                  Ending Date: {record.ending_date_trial}
                </>
              }
            >
              {/* {moment(date).fromNow(true) + ' left'} */}
              {record.trial_due}
            </Tooltip>
          ) : (
            <Tooltip
              placement="topLeft"
              title={
                <>
                  Trial Date: {record.created_at_date_time}
                  <br />
                  Ending Date: {record.ending_date_trial}
                </>
              }
            >
              <span style={{ color: "red" }}>{record.trial_due}</span>
            </Tooltip>
          )
        ) : (
          stringFallback()
        ),
      ...getColumnSortPropsExport({
        dataIndex: "trial_due",
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
      defaultSortOrder: "ascend",
      width: 150,
      // fixed: 'left',
    },
    {
      title: "Membership ID",
      dataIndex: "memberships_id",
      key: "memberships_id",
      ...getColumnSearchProps(["memberships_id"]),
      ...getColumnSortProps("memberships_id"),
      width: 150,
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
      ...getColumnSearchProps(["client_name", "project_name"]),
      render: (clientName, record) => (
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
      ),
      ...getColumnSortProps("client_name"),
      width: 150,
    },
    {
      title: "Product/Service",
      key: "class_accounting_name",
      dataIndex: "class_accounting_name",
      ...getColumnSearchProps(["class_accounting_name"]),
      ...getColumnSortProps("class_accounting_name"),
      // fixed: 'left',
      width: 150,
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
      // ...getCustomColumnSortProps('last_action'),
      ...getCustomColumnSortProps({
        sorter: (a, b) => {
          return moment(
            moment(a.created_at || "Jan 01, 1970", "MMM DD, YYYY")
          ).diff(moment(b.created_at || "Jan 01, 1970", "MMM DD, YYYY"))
        },
      }),
      render: (date, record) => (
        <Tooltip placement="topLeft" title={record.created_at_hour}>
          {record.created_at}
        </Tooltip>
      ),
      // fixed: 'left',
      width: 120,
    },
    {
      title: "Last Action",
      dataIndex: "last_action",
      key: "last_action",
      ...getColumnSearchProps(["last_action"]),
      ...getColumnSortProps("last_action"),
      // fixed: 'left',
      width: 150,
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.last_action}>
          {record.last_action}
          <br />
          {record.last_action_date}
        </Tooltip>
      ),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps(["email"]),
      ...getColumnSortProps("email"),
      // fixed: 'left',
      width: 200,
      render: (text, record) => (
        <Tooltip placement="topLeft" title={record.email}>
          {record.email}
        </Tooltip>
      ),
    },
    {
      title: "URL",
      dataIndex: "wordpress_install_url",
      key: "wordpress_install_url",
      ...getColumnSearchProps(["wordpress_install_url"]),
      ...getColumnSortProps("wordpress_install_url"),
      // fixed: 'left',
      width: 400,
      render: (url) => (
        <a href={url} target="_blank" rel="noreferrer">
          <Tooltip placement="topLeft" title={url}>
            {url}
          </Tooltip>
        </a>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      ...getColumnSearchProps(["status"]),
      ...getColumnSortProps("status"),
      // fixed: 'left',
      width: 120,
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
        { id, registration_key, cycle_billing_type, memberships_id }
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
            Memberships Trial ({total})
          </Typography.Title>
          <Typography.Title level={5} style={{ margin: 0 }}>
            Price:{" "}
            {typeof totalPrice === "number" ? (
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
          {/* {console.log({ memberships })} */}
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
      </div>
      <Radio.Group
        onChange={(e) => {
          setradioBoxFIltred(e.target.value)
          setFiltredValue("")
          setFilterUsers([])
        }}
        value={radioBoxFIltred}
      >
        <Radio value={"trial_on_going"}>On Going</Radio>
        <Radio value={"trial_due"}>Trial Due</Radio>
        <Radio value={"trial_canceled"}>Canceled</Radio>
        <Radio value={"trial_unsuccessful_payment"}>Unsuccessful Payment</Radio>
      </Radio.Group>
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
        rowSelection={{
          selectedRowKeys: selectedRow,
          renderCell: () => "",
          columnTitle: " ",
          columnWidth: "8px",
        }}
        scroll={{ x: "100%" }}
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
