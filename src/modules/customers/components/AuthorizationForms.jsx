import {
  CopyOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  FileProtectOutlined,
  RetweetOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Button, Modal, notification, Space, Table, Tooltip } from 'antd'
import moment from 'moment'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  useReplaceAuthorizationFormMutation,
  useResendAuthorizationFormMutation,
  useSendAuthorizationFormMutation,
} from '../../../app/api/billing'
import { getColumnProps, showTotal, stringFallback } from '../../../helpers'
import { AFTimeLine } from './AFTimeLine'
import { DocumentPDF } from './DocumentPDF'
import { FormAuth } from './FormAuth'
import { FormReSend } from './FormReSend'

export const AuthorizationForms = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {
  const ACHHistory = achData.map(({ create_at, completed_at, status }) => ({
    completed_at,
    create_at,
    status,
  }))
  const cardHistory = cardData.map(({ create_at, completed_at, status }) => ({
    completed_at,
    create_at,
    status,
  }))
  const rows = [
    achData.length === 0
      ? {
        id: '-1',
        authorization_form_type: 'ACH',
        status: '',
        document: null,
      }
      : achData[0],
    cardData.length === 0
      ? {
        id: '-2',
        authorization_form_type: 'Card',
        status: '',
        document: null,
      }
      : cardData[0],
  ]
  const principalACH = achData.find(item => item.is_principal === '1')
  const principalCard = cardData.find(item => item.is_principal === '1')

  const { confirm } = Modal
  const [sendAuthorizationForm] = useSendAuthorizationFormMutation()
  const [resendAuthorizationForm] = useResendAuthorizationFormMutation()
  const [replaceAuthorizationForm] = useReplaceAuthorizationFormMutation()

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [autorization, setAutorization] = useState('')

  const [openReSend, setOpenReSend] = useState(false)
  const handleOpenReSend = () => setOpenReSend(true)
  const handleCloseReSend = () => setOpenReSend(false)

  const [values, setValues] = useState([])
  const handleSubmitDinamic = (data) => {
    setValues(values.push(data))
  }

  const handleSend = ({ authorization_form_type }) => {
    setAutorization(authorization_form_type)
    handleOpen()
  }

  const handleResend = ({ authorization_form_type }) => {
    setAutorization(authorization_form_type)
    handleOpenReSend()
  }

  // confirm({
  //   title: `Are you sure you want to send the ${authorization_form_type}?`,
  //   icon: <ExclamationCircleFilled />,
  //   content: <FormAuth 
  //   handleSubmitDinamic={handleSubmitDinamic} 
  //   authorization_form_type={authorization_form_type}
  //   registration_key={registration_key}
  //   user_id={user_id}
  //   />,
  //   // content: 'Some descriptions',
  //   async onOk() {
  //     try {
  //       const res = await sendAuthorizationForm({
  //         authorization_form_type,
  //         registration_key,
  //         user_id,
  //         labels_prices: values[0]
  //       }).unwrap()
  //       onSuccess()
  //       console.log({ res })
  //       notification.success({
  //         message: `The ${authorization_form_type} form has been sent succesfully.`,
  //         placement: 'bottomRight',
  //         // description: '',
  //       })
  //     } catch (error) {
  //       console.log({ error })
  //       notification.error({
  //         message: error.data?.message || 'Error',
  //         placement: 'bottomRight',
  //         // description: '',
  //       })
  //     }
  //   },
  //   onCancel() {
  //     console.log('Cancel')
  //   },
  // })

  // const handleResend = ({
  //   authorization_form_type,
  //   registration_key,
  //   user_id,
  // }) => {
  //   confirm({
  //     title: `Are you sure you want to re-send the ${authorization_form_type}?`,
  //     icon: <ExclamationCircleFilled />,
  //     content: <FormAuth handleSubmitDinamic={handleSubmitDinamic} />,
  //     // content: 'Some descriptions',
  //     async onOk() {
  //       try {
  //         const res = await resendAuthorizationForm({
  //           authorization_form_type,
  //           registration_key,
  //           user_id,
  //         }).unwrap()
  //         onSuccess()
  //         console.log({ res })
  //         notification.success({
  //           message: `The ${authorization_form_type} form has been re-sent succesfully.`,
  //           placement: 'bottomRight',
  //           // description: '',
  //         })
  //       } catch (error) {
  //         console.log({ error })
  //         notification.error({
  //           message: error.data?.message || 'Error',
  //           placement: 'bottomRight',
  //           // description: '',
  //         })
  //       }
  //     },
  //     onCancel() {
  //       console.log('Cancel')
  //     },
  //   })
  // }
  const handleReplace = ({
    authorization_form_type,
    registration_key,
    user_id,
  }) => {
    confirm({
      title: `Are you sure you want to replace the ${authorization_form_type}?`,
      icon: <ExclamationCircleFilled />,
      content: <FormAuth handleSubmitDinamic={handleSubmitDinamic} />,
      // content: 'Some descriptions',
      async onOk() {
        try {
          const res = await replaceAuthorizationForm({
            authorization_form_type,
            registration_key,
            user_id,
          }).unwrap()
          onSuccess()
          console.log({ res })
          notification.success({
            message: `The ${authorization_form_type} form has been replaced succesfully.`,
            placement: 'bottomRight',
            // description: '',
          })
        } catch (error) {
          notification.error({
            message: error.data?.message || 'Error',
            placement: 'bottomRight',
            // description: '',
          })
        }
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  const columns = [
    {
      ...getColumnProps({
        title: 'Name',
        dataIndex: 'authorization_form_type',
      }),
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
      render(text, { completed_at, create_at, authorization_form_type }) {
        if (authorization_form_type === 'ACH')
          return (
            <AFTimeLine
              history={ACHHistory}
              authorization_form_type={authorization_form_type}
              completed_at={completed_at && moment(completed_at).format('ll')}
              create_at={
                create_at ? moment(create_at).format('ll') : stringFallback()
              }
            />
          )
        return (
          <AFTimeLine
            history={cardHistory}
            authorization_form_type={authorization_form_type}
            completed_at={completed_at && moment(completed_at).format('ll')}
            create_at={
              create_at
                ? moment(create_at).format('MM-DD-YYYY')
                : stringFallback()
            }
          />
        )
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { status, authorization_form_type }) => (
        <>
          <Space size='middle'>
            {
              (window.isAch && window.isAch === '1') && (
                (status === 'Waiting for client' || status === 'Completed') &&
                (authorization_form_type === 'ACH'
                  ? !!principalACH?.document
                  : !!principalCard?.document) && (
                  <DocumentPDF id={authorization_form_type === 'ACH' ? principalACH.id : principalCard.id} />
                )
              )
            }
            {status === 'Waiting for client' || status === 'Completed' || (
              <Tooltip title={'Send'} overlayStyle={{ zIndex: 10000 }}>
                <a  >
                  <SendOutlined
                    onClick={() => handleSend({ authorization_form_type })}
                    style={{ fontSize: '18px' }}
                  />
                </a>

              </Tooltip>
            )}
            {status === 'Waiting for client' && (
              <Tooltip title='Edit' overlayStyle={{ zIndex: 10000 }}>
                <a onClick={handleOpenReSend}>
                  <EditOutlined
                    onClick={() => handleResend({ authorization_form_type })}
                    style={{ fontSize: '18px' }}
                  />
                </a>
              </Tooltip>
            )}
            {status === 'Completed' && (
              <Tooltip title='Replace' overlayStyle={{ zIndex: 10000 }}>
                <a >
                  <CopyOutlined
                    style={{ fontSize: '18px' }}
                    onClick={() =>
                      handleReplace({
                        authorization_form_type,
                        registration_key: registrationKey,
                        user_id: userId,
                      })
                    }
                  />
                </a>
              </Tooltip>
            )}
          </Space>
        </>
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
      {open && (
        <FormAuth
          authorization_form_type={autorization}
          registration_key={registrationKey}
          user_id={userId}
          open={open}
          onClose={handleClose}
          onSuccess={onSuccess}
        />
      )}
      {openReSend && (
        <FormReSend
          authorization_form_type={autorization}
          registration_key={registrationKey}
          user_id={userId}
          open={openReSend}
          onClose={handleCloseReSend}
          onSuccess={onSuccess}
        />
      )}
    </>
  )
}
