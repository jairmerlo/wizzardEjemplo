import {
  CopyOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  RetweetOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Button, Modal, notification, Space, Table, Tooltip } from 'antd'
import { Checkbox, Form, Input } from 'antd'

import moment from 'moment'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCss } from 'react-use'
import {
  useGetPdfInvoiceQuery,
  useListAccountInvoiceByRegkeyQuery,
  useReplaceAuthorizationFormMutation,
  useResendAuthorizationFormMutation,
  useSendAuthorizationFormMutation,
} from '../../../app/api/billing'
import { getColumnProps, showTotal } from '../../../helpers'
import { AFTimeLine } from './AFTimeLine'
import * as Yup from 'yup'

export const BillinHistory = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {
  const [id, setId] = useState(null)

  const { data: billinHistoryData = [], isLoading: isLoadingH } =
    useListAccountInvoiceByRegkeyQuery(
      { registration_key: registrationKey },
      {
        skip: !registrationKey,
      },
    )

  const {
    data: pdfData = [],
    isLoading: isLoadingPdf,
    refetch: refetchPDF,
  } = useGetPdfInvoiceQuery(
    { id: id },
    {
      skip: !id,
    },
  )

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleViewPdf = async id => {
    setId(id)
    refetchPDF()
    console.log('ss', id)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const form = useCss({
    display: 'grid',
    gridTemplateColumns: '49% 49%',
    columnGap: '16px',
    rowGap: '30px',
    '& > .ant-form-item': {
      margin: '0px',
    },
    '@media only screen and (max-width: 745px)': {
      gridTemplateColumns: '1fr',
    },
  })

  const form3 = useCss({
    display: 'grid',
    gridTemplateColumns: '23.7% 23.7% 49%',
    columnGap: '16px',
    rowGap: '30px',
    '& > .ant-form-item': {
      margin: '0px',
    },
    '@media only screen and (max-width: 745px)': {
      gridTemplateColumns: '1fr',
    },
  })

  const columns = [
    {
      ...getColumnProps({
        title: 'INVOICE #',
        dataIndex: 'name',
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
        dataSource={billinHistoryData}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoadingH}
      />

      {/* <Modal
        title='Payment Billing Information'
        width='60%'
        open={isModalOpen}
        footer={[]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout='vertical' autoComplete='off' style={{marginTop: '24px', marginBottom: '30px'}}>
          <div className={form} style={{ gap: '16px' }}>
            <Form.Item
              label='Payment Method'
              
            >
              <Input name='payment_method' placeholder='Payment Method' value={'Card'} disabled />
            </Form.Item>
            <Form.Item
              label='Credit Card'
            >
              <Input name='credit_card' placeholder='Credit Card' disabled value={cardInfo.credit_card_number ? '**** **** **** ' + cardInfo.credit_card_number.substring(cardInfo.credit_card_number.length - 4) : ''} />
            </Form.Item>
          </div>

          <div className={form3} style={{ gap: '16px', marginTop: '12px' }}>
            <Form.Item
              label='Expires(MM/YY)'
              
            >
              <Input name='expires' placeholder='Expires(MM/YY)' disabled value={cardInfo.expiration_date ? moment(cardInfo.expiration_date).format('MM/YYYY') : ''} disabled />
            </Form.Item>
            <Form.Item
              label='CVC'
            >
              <Input name='cvc' placeholder='CVC' disabled value={cardInfo.cvc ? '****' : ''} />
            </Form.Item>
            <Form.Item
              label='Company Billing'
            >
              <Input name='company' disabled placeholder='Company Billing' value={cardInfo.company ? cardInfo.company : ''} />
            </Form.Item>
          </div>

          <div  style={{ marginTop: '12px' }}>
            <Form.Item
              label='Billing Address'
              
            >
              <Input name='billing_address' placeholder='Billing Address' disabled value={cardInfo.address ? cardInfo.address : ''}  />
            </Form.Item>           
          </div>

          <div  style={{  marginTop: '-12px' }}>
            <Form.Item
              label='Billing Address2'
              
            >
              <Input name='billing_address2' placeholder='Billing Address2' disabled value={cardInfo.address ? cardInfo.address : ''}  />
            </Form.Item>           
          </div>

          <div className={form3} style={{ gap: '16px', marginTop: '-12px' }}>
            <Form.Item
              label='City'
              
            >
              <Input name='city' placeholder='City' disabled value={cardInfo.city ? cardInfo.city : ''} />
            </Form.Item>
            <Form.Item
              label='State / Region'
            >
              <Input name='region' placeholder='State/Region' disabled value={cardInfo.region ? cardInfo.region : ''} />
            </Form.Item>
            <Form.Item
              label='Zip / Postal Code'
            >
              <Input name='zip_code' disabled placeholder='Zip / Postal Code' value={cardInfo.zip_code ? cardInfo.zip_code : ''} />
            </Form.Item>
          </div>
         
        </Form>
      </Modal> */}
    </>
  )
}
