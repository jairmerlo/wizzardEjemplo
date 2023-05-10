import {
  FilePdfOutlined,
} from '@ant-design/icons'
import {
  Modal,
  Skeleton,
  Table,
} from 'antd'

import moment from 'moment'
import { useState } from 'react'
import {
  useListAccountInvoiceByRegkeyQuery,
} from '../../../app/api/billing'
import {
  getColumnProps,
  showTotal,
} from '../../../helpers'
import { API } from '../../../api'
import { useCss } from 'react-use'

export const BillinHistory = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {

  const { data: billinHistoryData = [], isLoading: isLoadingH } =
    useListAccountInvoiceByRegkeyQuery(
      { registration_key: registrationKey },
      {
        skip: !registrationKey,
      },
    )

  console.log({ billinHistoryData })

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

  const [pdfs, setPdfS] = useState([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewPdf = async ({ id }) => {
    setPdfS([])
    setIsModalOpen(true)
    console.log({ id })
    const res = await fetch(API._BILLING_HOST + '/get-invoice-pdf/' + id, {
      method: 'get',
    }).then(res => res.json())
    setPdfS(res)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns = [
    {
      ...getColumnProps({
        title: 'INVOICE #',
        dataIndex: 'invoice_number',
      }),
      render: (text, id) => <button style={{ color: 'blue', border: 'none', backgroundColor: 'white' }} className='underlineHover' onClick={() => handleViewPdf(id)}>{text}</button>,
    },
    {
      ...getColumnProps({
        title: 'Status',
        dataIndex: 'status',
      }),
    },
    {
      ...getColumnProps({
        title: 'Date',
        dataIndex: 'date',
      }),
      render(text, { created_at }) {
        return <td>{moment(created_at).format('ll')}</td>
      },
    },
    {
      ...getColumnProps({
        title: 'AMOUNT',
        dataIndex: 'total',
      }),
      render(text, { total }) {
        return <td>${total}</td>
      },
    },
  ]
  return (
    <>
      <Table
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={billinHistoryData}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoadingH}
      />

      <Modal
        title='Payment Billing Information'
        width='50%'
        style={{ height: '20px' }}
        open={isModalOpen}
        footer={[]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {pdfs.url && (
          <object
            data={pdfs.url}
            type='application/pdf'
            style={{ width: '100%', height: '700px' }}
          >
            <iframe frameborder='0' width={'100%'} title='pdf'></iframe>
          </object>
        )}

        {!pdfs.url && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton.Node active={true} size={'large'} block={true}>
              <FilePdfOutlined
                style={{
                  fontSize: 60,
                  color: '#bfbfbf',
                }}
              />
            </Skeleton.Node>
          </div>
        )}
      </Modal>
    </>
  )
}
