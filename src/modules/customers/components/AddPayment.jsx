import { Table } from "antd"
import { useGetListPaymentsQuery } from "../../../app/api/backoffice"
import { getColumnProps, showTotal } from "../../../helpers"

export const AddPayment = ({ registration_key }) => {
  const { data: listPayments = [], isLoading: isLoadingPayment } =
    useGetListPaymentsQuery({ registrationKey: registration_key })
  console.log({ listPayments })
  // const dataColumn = listPayments[0]
  const columns = [
    {
      ...getColumnProps({
        title: "Paid Date",
        dataIndex: "paidDate",
      }),
    },
    {
      ...getColumnProps({
        title: "$ Amount",
        dataIndex: "amount",
      }),
    },
    {
      ...getColumnProps({
        title: "Invoice#",
        dataIndex: "invoiceNumber",
      }),
    },
    {
      title: "Invoice Period",
      dataIndex: "invoicePeriodInit",
      colSpan: 2,
      render(text, { invoicePeriodEnd }) {
        return (
          <div>
            <strong>Init: </strong>
            {invoicePeriodEnd}
          </div>
        )
      },
    },
    {
      title: "Invoice Period",
      dataIndex: "invoicePeriodEnd",
      colSpan: 0,
      render(text, { invoicePeriodInit }) {
        return (
          <div>
            <strong>End: </strong> {invoicePeriodInit}
          </div>
        )
      },
    },
    {
      ...getColumnProps({
        title: "Source Payment",
        dataIndex: "sourcePayment",
      }),
    },
    {
      ...getColumnProps({
        title: "Program/Product",
        dataIndex: "programName",
      }),
    },
    {
      ...getColumnProps({
        title: "Note",
        dataIndex: "note",
      }),
    },
    {
      ...getColumnProps({
        title: "Attach File",
        dataIndex: "attachFile",
      }),
      render(text, { attachFile }) {
        return (
          <div>
            {attachFile !== null && <a href={attachFile}>attachFile</a>}
          </div>
        )
      },
    },
  ]

  return (
    <>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={listPayments}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoadingPayment}
      />
    </>
  )
}
