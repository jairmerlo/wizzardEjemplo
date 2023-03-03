import { EyeTwoTone } from '@ant-design/icons'
import { Modal, Space, Table, Tooltip } from 'antd'

import moment from 'moment'
import { useLayoutEffect, useState } from 'react'
import { useListAgreementByRegkeyQuery } from '../../../app/api/billing'
import { getColumnProps, showTotal } from '../../../helpers'

import '../../../../src/index.css'

export const AgreementHistory = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {
  const { data: agreementHistoryData = [], isLoading: isLoadingH } =
    useListAgreementByRegkeyQuery(
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

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleViewPdf = async id => {
    // setPdfS([])
    // setIsModalOpen(true)
    // const res = await fetch(API._BILLING_HOST + '/get-invoice-pdf/' + id, {
    //   method: 'get',
    // }).then(res => res.json())
    // setPdfS(res)

    if (agreementHistoryData.find(data => data.id === id)) {
      setPdfS(agreementHistoryData.find(data => data.id === id))
    } else {
      setPdfS([])
    }

   

   
    setIsModalOpen(true)
  }

  useLayoutEffect(() => {
    let elemento = document.getElementsByClassName('content')

    if (elemento[0]) {
      elemento[0].parentElement.remove()
    }

    Array.from(document.getElementsByTagName('p')).forEach(element => {
    
      if (element.innerHTML === '&nbsp;' || element.innerHTML === '[@signature]') {
        console.log('removed')
        element.remove()
      }
    })

  }, [pdfs])

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns = [
    {
      ...getColumnProps({
        title: 'Date Signed',
        dataIndex: 'token_date',
      }),
      render(text, { token_date }) {
        return <td>{moment(token_date).format('MM-DD-YYYY')}</td>
      },
    },
    {
      ...getColumnProps({
        title: 'Service/Product',
        dataIndex: 'agreement_name',
      }),
      render(text, { agreement_name }) {
        return <td>{agreement_name}</td>
      },
    },
    {
      ...getColumnProps({
        title: 'Agreement Type',
        dataIndex: 'agreement_type',
      }),
      render(text, { agreement_type }) {
        return <td>{agreement_type}</td>
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { id }) => (
        <Space size='middle'>
          <Tooltip
            title='Details'
            overlayStyle={{ zIndex: 10000 }}
            onClick={() => handleViewPdf(id)}
          >
            <EyeTwoTone style={{ fontSize: '18px' }} />
          </Tooltip>
        </Space>
      ),
    },
  ]
  return (
    <>
      <Table
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={agreementHistoryData}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoadingH}
      />

      <Modal
        title=''
        width='50%'
        style={{ height: '20px', top: '10px' }}
        open={isModalOpen}
        footer={[]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {pdfs.agreement_content && (
          <>
            <div
              dangerouslySetInnerHTML={{ __html: pdfs.agreement_content }}
            ></div>

            <div className='ms-wrapper-signature'>
              <span className='ms-siganture-text'>{pdfs.membership_agreement_name}</span>
              <div className='ms-info-client'>
                <span>{pdfs.token_date} </span>
                <span></span>
                <span>{pdfs.token}</span>
              </div>
            </div>

            <p>[@signature]</p>
          </>
        )}
      </Modal>
    </>
  )
}
