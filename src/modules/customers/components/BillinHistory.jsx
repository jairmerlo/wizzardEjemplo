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

  // console.log({ pdfs })
  // useEffect(()=>{
  //   setPdfS(pdfData)
  // },[pdfData])

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // const form = useCss({
  //   display: 'grid',
  //   gridTemplateColumns: '49% 49%',
  //   columnGap: '16px',
  //   rowGap: '30px',
  //   '& > .ant-form-item': {
  //     margin: '0px',
  //   },
  //   '@media only screen and (max-width: 745px)': {
  //     gridTemplateColumns: '1fr',
  //   },
  // })

  // const form3 = useCss({
  //   display: 'grid',
  //   gridTemplateColumns: '23.7% 23.7% 49%',
  //   columnGap: '16px',
  //   rowGap: '30px',
  //   '& > .ant-form-item': {
  //     margin: '0px',
  //   },
  //   '@media only screen and (max-width: 745px)': {
  //     gridTemplateColumns: '1fr',
  //   },
  // })

  const columns = [
    {
      ...getColumnProps({
        title: 'INVOICE #',
        dataIndex: 'invoice_number',
      }),
      render: (text, id) => <a href onClick={() => handleViewPdf(id)}>{text}</a>,
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
