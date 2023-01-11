import {
  CopyOutlined,
  ExclamationCircleFilled,
  EyeTwoTone,
  RetweetOutlined,
  SendOutlined,
} from '@ant-design/icons'
import { Modal, notification, Space, Table, Tooltip } from 'antd'
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
}) => {
  const rows = [
    achData.length === 0
      ? {
          authorization_form_type: 'ACH',
          status: '',
        }
      : achData[0],
    cardData.length === 0
      ? {
          authorization_form_type: 'Card',
          status: '',
        }
      : cardData[0],
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
          console.log({ res })
          notification.success({
            message: `The ${authorization_form_type} form has been sent succesfully.`,
            placement: 'bottomRight',
            // description: '',
          })
        } catch (error) {
          notification.error({
            message: error.data.message,
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
          console.log({ res })
          notification.success({
            message: `The ${authorization_form_type} form has been re-sent succesfully.`,
            placement: 'bottomRight',
            // description: '',
          })
        } catch (error) {
          notification.error({
            message: error.data.message,
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
          console.log({ res })
          notification.success({
            message: `The ${authorization_form_type} form has been replaced succesfully.`,
            placement: 'bottomRight',
            // description: '',
          })
        } catch (error) {
          notification.error({
            message: error.data.message,
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
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, { authorization_form_type, status }) => (
        <Space size='middle'>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          {(status === 'Waiting for client' || status === 'Complete') && (
            <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
              <a>
                <EyeTwoTone style={{ fontSize: '18px' }} />
              </a>
            </Tooltip>
          )}
          {status === 'Waiting for client' || status === 'Complete' || (
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
          {status === 'Complete' && (
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
