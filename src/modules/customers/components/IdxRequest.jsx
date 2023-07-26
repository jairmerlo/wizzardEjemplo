import { Table } from "antd"
import { useGetRequestByregKeyQuery } from "../../../app/api/billing"
import { getColumnProps, showTotal } from "../../../helpers"

export const IdxRequest = ({ registration_key }) => {
  // console.log({ registration_key })
  const { data = [], isLoading } = useGetRequestByregKeyQuery({
    registration_key,
  })

  const rows = data
  console.log({ rows })

  let columns = []

  if (rows[0]?.user_type === "agent") {
    columns = [
      {
        ...getColumnProps({
          title: "Status",
          dataIndex: "status",
        }),
        render(text, data) {
          if (data?.status === "Pending") {
            return <div>Pending Accept IDX Request</div>
          } else if (data?.status === "Pending Data") {
            return <div>Pending IDX Request Form</div>
          } else if (data?.status === "Pending Accept Board") {
            return <div>Pending Accept IDX Request</div>
          } else {
            return <div>{data.status}</div>
          }
        },
      },
      {
        ...getColumnProps({
          title: "Real Estate Agent",
          dataIndex: "user_type",
        }),
        render(text, data) {
          return <div>Real Estate Agent(Realtor)</div>
        },
      },
      {
        ...getColumnProps({
          title: "Agent Name",
          dataIndex: "agent_first_name",
        }),
        render(text, data) {
          return (
            <div>
              {data?.agent_first_name} {data?.agent_last_name}
            </div>
          )
        },
      },
      {
        ...getColumnProps({
          title: "Agent Email",
          dataIndex: "agent_email",
        }),
      },
      {
        ...getColumnProps({
          title: "Phone Number",
          dataIndex: "phone",
        }),
      },
      {
        ...getColumnProps({
          title: "MLS Board",
          dataIndex: "board_name",
        }),
      },
      {
        ...getColumnProps({
          title: "Agent MLS ID",
          dataIndex: "item_agent_mls_board_id",
        }),
      },
      {
        ...getColumnProps({
          title: "Broker Company Name",
          dataIndex: "broker_company_name",
        }),
      },
      {
        ...getColumnProps({
          title: "Broker Name",
          dataIndex: "broker_first_name",
        }),
        render(text, data) {
          return (
            <div>
              {data?.broker_first_name} {data?.broker_last_name}
            </div>
          )
        },
      },
      {
        ...getColumnProps({
          title: "Broker Email",
          dataIndex: "broker_email",
        }),
      },
      {
        ...getColumnProps({
          title: "Broker Phone Number",
          dataIndex: "broker_phone_number",
        }),
      },
    ]
  } else {
    columns = [
      {
        ...getColumnProps({
          title: "Status",
          dataIndex: "status",
        }),
        render(text, data) {
          if (data?.status === "Pending") {
            return <div>Pending Accept IDX Request</div>
          } else if (data?.status === "Pending Data") {
            return <div>Pending IDX Request Form</div>
          } else if (data?.status === "Pending Accept Board") {
            return <div>Pending Accept IDX Request</div>
          } else {
            return <div>{data.status}</div>
          }
        },
      },
      {
        ...getColumnProps({
          title: "Real State Agent",
          dataIndex: "user_type",
        }),
        render(text, data) {
          return <div>Real Estate Broker</div>
        },
      },
      {
        ...getColumnProps({
          title: "MLS Board",
          dataIndex: "board_name",
        }),
      },
      {
        ...getColumnProps({
          title: "Agent MLS ID",
          dataIndex: "item_agent_mls_board_id",
        }),
      },
      {
        ...getColumnProps({
          title: "Broker Company Name",
          dataIndex: "broker_company_name",
        }),
      },
      {
        ...getColumnProps({
          title: "Broker Name",
          dataIndex: "broker_first_name",
        }),
        render(text, data) {
          return (
            <div>
              {data?.broker_first_name} {data?.broker_last_name}
            </div>
          )
        },
      },
      {
        ...getColumnProps({
          title: "Broker Email",
          dataIndex: "broker_email",
        }),
      },
      {
        ...getColumnProps({
          title: "Broker Phone Number",
          dataIndex: "broker_phone_number",
        }),
      },
    ]
  }

  return (
    <>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={rows}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoading}
      />
    </>
  )
}
