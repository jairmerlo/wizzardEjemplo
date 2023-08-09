import { Button, Modal, Skeleton, Table, Tooltip } from "antd"
import { useGetListPaymentsQuery } from "../../../app/api/backoffice"
import { getColumnProps, showTotal } from "../../../helpers"
import { EyeTwoTone, FilePdfOutlined } from "@ant-design/icons"
import { useState } from "react"
import moment from "moment"

export const AddPayment = ({ registration_key }) => {
  const { data: listPayments = [], isLoading: isLoadingPayment } =
    useGetListPaymentsQuery({ registrationKey: registration_key })
  console.log({ listPayments })
  const [receipts, setReceipts] = useState([])
  const [isModalReceiptOpen, setIsModalReceiptOpen] = useState(false)

  // console.log({ receipts })

  const hadleViewReceipt = async (attachFile = "") => {
    setReceipts([])
    setIsModalReceiptOpen(true)
    setReceipts(attachFile)
  }

  // const dataColumn = listPayments[0]
  const columns = [
    {
      ...getColumnProps({
        title: "Paid Date",
        dataIndex: "paidDate",
      }),
      render(text, { paidDate }) {
        return <div>{moment(paidDate).format("MMM DD, YYYY")}</div>
      },
    },
    {
      ...getColumnProps({
        title: "$ Amount",
        dataIndex: "amount",
      }),
      render(text, { amount }) {
        return <div>${amount}.00</div>
      },
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
      render(text, { invoicePeriodInit }) {
        return (
          <div>
            <strong>Init: </strong>
            {invoicePeriodInit}
          </div>
        )
      },
    },
    {
      title: "Invoice Period",
      dataIndex: "invoicePeriodEnd",
      colSpan: 0,
      render(text, { invoicePeriodEnd }) {
        return (
          <div>
            <strong>End: </strong> {invoicePeriodEnd}
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
      render: (text, { attachFile }) => (
        <Button
          disabled={attachFile !== null ? false : true}
          onClick={() => hadleViewReceipt(attachFile)}
          style={{ backgroundColor: "transparent", border: "none" }}
        >
          <EyeTwoTone style={{ fontSize: "18px" }} />
        </Button>
      ),
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

      <Modal
        title="Receipt Billing Information"
        width="50%"
        style={{ height: "20px" }}
        open={isModalReceiptOpen}
        footer={[]}
        onOk={() => setIsModalReceiptOpen(false)}
        onCancel={() => setIsModalReceiptOpen(false)}
      >
        {receipts && (
          <object
            data={receipts}
            type="application/pdf"
            style={{ width: "100%", height: "700px" }}
          >
            <iframe frameBorder="0" width={"100%"} title="pdf"></iframe>
          </object>
        )}

        {!receipts && (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Skeleton.Node active={true} size={"large"} block={true}>
              <FilePdfOutlined
                style={{
                  fontSize: 60,
                  color: "#bfbfbf",
                }}
              />
            </Skeleton.Node>
          </div>
        )}
      </Modal>
    </>
  )
}
