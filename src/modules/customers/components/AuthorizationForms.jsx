import {
  CopyOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  RetweetOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Modal, notification, Space, Table, Tooltip } from 'antd'
import { Link, useParams } from 'react-router-dom'
import {
  useReplaceAuthorizationFormMutation,
  useResendAuthorizationFormMutation,
  useSendAuthorizationFormMutation,
} from '../../../app/api/billing'
import { getColumnProps, showTotal } from '../../../helpers'

export const AuthorizationForms = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {
  const { customerId, membershipId } = useParams()
  const rows = [
    achData.length === 0
      ? {
          id: '-1',
          authorization_form_type: 'ACH',
          status: '',
          document: null,
        }
      : achData.find(item => item.is_pricipal === '1') || achData[0],
    cardData.length === 0
      ? {
          id: '-2',
          authorization_form_type: 'Card',
          status: '',
          document: null,
        }
      : cardData.find(item => item.is_pricipal === '1') || cardData[0],
  ]

  const { confirm } = Modal
  const [sendAuthorizationForm] = useSendAuthorizationFormMutation()
  const [resendAuthorizationForm] = useResendAuthorizationFormMutation()
  const [replaceAuthorizationForm] = useReplaceAuthorizationFormMutation()

  const handleSend = ({
    authorization_form_type,
    registration_key,
    user_id,
  }) => {
    confirm({
      title: `Are you sure you want to send the ${authorization_form_type}?`,
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      async onOk() {
        try {
          const res = await sendAuthorizationForm({
            authorization_form_type,
            //TODO: Que registration Key va?
            registration_key,
            user_id,
          }).unwrap()
          onSuccess()
          console.log({ res })
          notification.success({
            message: `The ${authorization_form_type} form has been sent succesfully.`,
            placement: 'bottomRight',
            // description: '',
          })
        } catch (error) {
          console.log({ error })
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
  const handleResend = ({
    authorization_form_type,
    registration_key,
    user_id,
  }) => {
    confirm({
      title: `Are you sure you want to re-send the ${authorization_form_type}?`,
      icon: <ExclamationCircleFilled />,
      // content: 'Some descriptions',
      async onOk() {
        try {
          const res = await resendAuthorizationForm({
            authorization_form_type,
            registration_key,
            user_id,
          }).unwrap()
          onSuccess()
          console.log({ res })
          notification.success({
            message: `The ${authorization_form_type} form has been re-sent succesfully.`,
            placement: 'bottomRight',
            // description: '',
          })
        } catch (error) {
          console.log({ error })
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
  const handleReplace = ({
    authorization_form_type,
    registration_key,
    user_id,
  }) => {
    confirm({
      title: `Are you sure you want to replace the ${authorization_form_type}?`,
      icon: <ExclamationCircleFilled />,
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
      render() {
        return <span>01/02/23</span>
      },
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { authorization_form_type, status, document }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          {(status === 'Waiting for client' || status === 'Completed') &&
            !!document && (
              <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
                <Link
                  to={`/${customerId}/${authorization_form_type}/${membershipId}`}
                  target='_blank'
                >
                  <EyeTwoTone style={{ fontSize: '18px' }} />
                </Link>
              </Tooltip>
            )}
          {status === 'Waiting for client' || status === 'Completed' || (
            <Tooltip title='Send' overlayStyle={{ zIndex: 10000 }}>
              <a>
                <SendOutlined
                  style={{ fontSize: '18px' }}
                  onClick={() =>
                    handleSend({
                      authorization_form_type,
                      registration_key: registrationKey,
                      user_id: userId,
                    })
                  }
                />
              </a>
            </Tooltip>
          )}
          {status === 'Waiting for client' && (
            <Tooltip title='Re-Send' overlayStyle={{ zIndex: 10000 }}>
              <a>
                <RetweetOutlined
                  style={{ fontSize: '18px' }}
                  onClick={() =>
                    handleResend({
                      authorization_form_type,
                      registration_key: registrationKey,
                      user_id: userId,
                    })
                  }
                />
              </a>
            </Tooltip>
          )}
          {status === 'Completed' && (
            <Tooltip title='Replace' overlayStyle={{ zIndex: 10000 }}>
              <a>
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
          {/* eslint-enable jsx-a11y/anchor-is-valid */}
        </Space>
      ),
    },
  ]
  return (
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
  )
}
