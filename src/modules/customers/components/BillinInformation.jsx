import {
  CopyOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  RetweetOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Button, Modal, notification, Space, Table, Tooltip } from 'antd'
import { Checkbox, Form, Input } from 'antd';

import moment from 'moment'
import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCss } from 'react-use'
import {
  useReplaceAuthorizationFormMutation,
  useResendAuthorizationFormMutation,
  useSendAuthorizationFormMutation,
} from '../../../app/api/billing'
import { getColumnProps, showTotal } from '../../../helpers'
import { AFTimeLine } from './AFTimeLine'
import * as Yup from 'yup'

export const BillinInformation = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {
  const { customerId, membershipId } = useParams()

 console.log('aaaaaaaaa', achData)

  const ACHHistory = achData.map(
    ({
      create_at,
      completed_at,
      status,
      account_number,
      credit_card_number,
    }) => ({
      completed_at,
      account_number,
      credit_card_number,
      create_at,
      status,
    }),
  )
  const cardHistory = cardData.map(
    ({
      create_at,
      completed_at,
      status,
      account_number,
      credit_card_number,
    }) => ({
      completed_at,
      account_number,
      credit_card_number,
      create_at,
      status,
    }),
  )
  const rows = [
    achData.length === 0
      ? {
          id: '-1',
          authorization_form_type: 'ACH',
          status: '',
          document: null,
        }
      : achData.find(item => item.is_principal === '1') || achData[0],
    cardData.length === 0
      ? {
          id: '-2',
          authorization_form_type: 'Card',
          status: '',
          document: null,
        }
      : cardData.find(item => item.is_principal === '1') || cardData[0],
  ]


  const [cardInfo,setCardInfo] = useState(rows[1])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
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
        title: 'Payment Method',
        dataIndex: 'authorization_form_type',
      }),
    },
    {
      ...getColumnProps({
        title: 'Number',
        dataIndex: 'authorization_form_type',
      }),
      render(text, { completed_at, create_at, authorization_form_type }) {
        if (authorization_form_type === 'ACH') return <td>Account Number</td>
        return <td>Credit Card Number</td>
      },
    },
    {
      ...getColumnProps({
        title: 'Account',
        dataIndex: 'authorization_form_type',
      }),
      render(
        text,
        {
          completed_at,
          create_at,
          authorization_form_type,
          account_number,
          credit_card_number,
        },
      ) {
        if (authorization_form_type === 'ACH') return <td>{account_number ? '**** **** **** ' + account_number.substring(account_number.length - 4) : ''}</td>
        return <td>{credit_card_number ? '**** **** **** ' + credit_card_number.substring(credit_card_number.length - 4) : ''}</td>
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (
        text,
        { authorization_form_type, status, document, completed_at, created_at },
      ) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          {/* //TODO: remplazar por pdf */}
          {authorization_form_type === 'Card' && (
            <Tooltip
              title='Details'
              overlayStyle={{ zIndex: 10000 }}
              onClick={showModal}
            >
              <EyeTwoTone style={{ fontSize: '18px' }} />
            </Tooltip>
          )}

          {/* eslint-enable jsx-a11y/anchor-is-valid */}
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
        dataSource={rows}
        bordered
        pagination={{
          showTotal,
        }}
      />

      <Modal
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
      </Modal>
    </>
  )
}
