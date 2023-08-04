import { FilePdfOutlined } from "@ant-design/icons"
import { Modal, Skeleton, Table } from "antd"

import moment from "moment"
import { useState } from "react"
import { useListAccountInvoiceByRegkeyQuery } from "../../../app/api/billing"
import { getColumnProps, showTotal } from "../../../helpers"
import { API } from "../../../api"

export const BillinHistory = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = (f) => f,
}) => {
  const { data: billinHistoryData = [], isLoading: isLoadingH } =
    useListAccountInvoiceByRegkeyQuery(
      { registration_key: registrationKey },
      {
        skip: !registrationKey,
      }
    )

  console.log({ billinHistoryData })

  const [pdfs, setPdfS] = useState([])
  const [receipts, setReceipt] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalReceiptOpen, setIsModalReceiptOpen] = useState(false)

  const handleViewPdf = async ({ id }) => {
    setPdfS([])
    setIsModalOpen(true)
    const res = await fetch(API._BILLING_HOST + "/get-invoice-pdf/" + id, {
      method: "get",
    }).then((res) => res.json())
    console.log({ res })
    setPdfS(res)
  }

  const hadleViewReceipt = async ({ receipt_url, receipt_number }) => {
    setReceipt([])
    setIsModalReceiptOpen(true)
    const res = await fetch(API._BILLING_HOST + "/get-receipt-pdf", {
      method: "post",
      body: JSON.stringify({
        url_receipt: receipt_url,
        receipt_number,
      }),
    }).then((res) => res.json())
    console.log({ res })
    setReceipt(res)
  }

  const handleOk = () => {
    setIsModalOpen(false)
    setIsModalReceiptOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setIsModalReceiptOpen(false)
  }

  const columns = [
    {
      ...getColumnProps({
        title: "Invoice #",
        dataIndex: "invoice_number",
      }),
      render: (text, id) => (
        <button className="underlineHover" onClick={() => handleViewPdf(id)}>
          {text}
        </button>
      ),
    },
    {
      ...getColumnProps({
        title: "Receipt #",
        dataIndex: "receipt_number",
      }),
      render: (text, record) => (
        <button
          className="underlineHover"
          onClick={() => hadleViewReceipt(record)}
        >
          {text}
        </button>
      ),
    },
    {
      ...getColumnProps({
        title: "Status",
        dataIndex: "status",
      }),
    },
    {
      ...getColumnProps({
        title: "Date",
        dataIndex: "date",
      }),
      render(text, { created_at }) {
        return <td>{moment(created_at).format("ll")}</td>
      },
    },
    {
      ...getColumnProps({
        title: "Amount",
        dataIndex: "total",
      }),
      render(text, { total }) {
        return <td>${total}</td>
      },
    },
  ]
  return (
    <>
      <Table
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={billinHistoryData}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoadingH}
      />

      <Modal
        title="Receipt Billing Information"
        width="50%"
        style={{ height: "20px" }}
        open={isModalReceiptOpen}
        footer={[]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {receipts.url && (
          <object
            data={receipts.url}
            type="application/pdf"
            style={{ width: "100%", height: "700px" }}
          >
            <iframe frameBorder="0" width={"100%"} title="pdf"></iframe>
          </object>
        )}

        {!receipts.url && (
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

      <Modal
        title="Payment Billing Information"
        width="50%"
        style={{ height: "20px" }}
        open={isModalOpen}
        footer={[]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {pdfs.url && (
          <object
            data={pdfs.url}
            type="application/pdf"
            style={{ width: "100%", height: "700px" }}
          >
            <iframe frameBorder="0" width={"100%"} title="pdf"></iframe>
          </object>
        )}

        {!pdfs.url && (
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
