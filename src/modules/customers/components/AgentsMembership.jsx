import { Table } from 'antd'

// import { useState } from 'react'
import { useGetAgentsMembershipQuery } from '../../../app/api/backoffice'
import { getColumnProps, showTotal } from '../../../helpers'

export const AgentsMembership = ({ registrationKey }) => {
  const { data: theamData = [], isLoading: isLoadingH } =
    useGetAgentsMembershipQuery(
      { registration_key: registrationKey },
      {
        skip: !registrationKey,
      },
    )

  // let {
  //   data: pdfData = [],
  //   isLoading: isLoadingPdf,
  //   refetch: refetchPDF,
  // } = useGetPdfInvoiceQuery(
  //   { id: id },
  //   {
  //     skip: !id,
  //   },
  // )

  // const [pdfs, setPdfS] = useState([])

  // const [isModalOpen, setIsModalOpen] = useState(false)

  // const showModal = () => {
  //   setIsModalOpen(true)
  // }

  // const handleViewPdf = async id => {
  //   // setPdfS([])
  //   // setIsModalOpen(true)
  //   // const res = await fetch(API._BILLING_HOST + '/get-invoice-pdf/' + id, {
  //   //   method: 'get',
  //   // }).then(res => res.json())
  //   // setPdfS(res)

  //   if (theamData.find(data => data.id === id)) {
  //     setPdfS(theamData.find(data => data.id === id))
  //   } else {
  //     setPdfS([])
  //   }

  //   setIsModalOpen(true)
  // }

  // const handleOk = () => {
  //   setIsModalOpen(false)
  // }

  // const handleCancel = () => {
  //   setIsModalOpen(false)
  // }

  const columns = [
    {
      ...getColumnProps({
        title: 'Name',
        dataIndex: 'full_name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Profile Name',
        dataIndex: 'profile_name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Username',
        dataIndex: 'username',
      }),
    },
    {
      ...getColumnProps({
        title: 'Email',
        dataIndex: 'email',
      }),
    },
    {
      ...getColumnProps({
        title: 'Phone',
        dataIndex: 'phone',
      }),
    },
  ]
  return (
    <>
      <Table
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={theamData}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoadingH}
      />
    </>
  )
}
