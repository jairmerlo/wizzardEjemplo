import {
  Avatar,
  Button,
  Card,
  Divider,
  Segmented,
  Spin,
  Typography,
} from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import Modal from 'react-modal'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useGetCustomerQuery } from '../../../app/api/billing'
import { ErrorHandler } from '../../../components'
import { stringAvatar, stringFallback } from '../../../helpers'
import { MembershipTable } from './MembershipTable'

export const CustomerView = () => {
  const { customerId } = useParams()
  const navigate = useNavigate()
  const { data = {}, isLoading } = useGetCustomerQuery(customerId)
  console.log({ data })
  const {
    name,
    last_name,
    phone,
    email_contact,
    street1,
    state,
    created_on,
    memberships,
  } = data
  const fullName = name + ' ' + last_name
  const isError = Array.isArray(data) || Object.keys(data).length === 0
  Modal.setAppElement('body')
  const gridStyle = {
    width: '100%',
    textAlign: 'left',
    padding: 0,
    paddingLeft: 12,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
  }
  return (
    <Modal
      isOpen={true}
      onRequestClose={() => navigate('/')}
      shouldCloseOnEsc={true}
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: 0,
        },
        overlay: {
          backgroundColor: '#fff',
          zIndex: 10000,
        },
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Customer View
        </Typography.Title>
        <Link to='/'>
          <Button size='small' danger>
            Back
          </Button>
        </Link>
      </div>
      <Divider />
      {isLoading ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : isError ? (
        <ErrorHandler
          description='The customer does not exist.'
          style={{ height: 'auto' }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', width: '100%' }}>
            <Avatar {...stringAvatar(fullName)} size={200} shape='square' />
            <Card style={{ borderRadius: 0, display: 'flex' }}>
              <Card.Grid style={gridStyle}>
                {stringFallback(fullName)}
              </Card.Grid>
              <Card.Grid style={gridStyle}>{stringFallback(phone)}</Card.Grid>
              <Card.Grid style={gridStyle}>
                {stringFallback(email_contact)}
              </Card.Grid>
              <Card.Grid style={gridStyle}>{stringFallback(street1)}</Card.Grid>
              <Card.Grid style={gridStyle}>{stringFallback(state)}</Card.Grid>
              <Card.Grid style={gridStyle}>{`Since ${created_on}`}</Card.Grid>
            </Card>
          </div>
          <Segmented
            options={['Membership', 'Billing', 'Quotes']}
            style={{
              alignSelf: 'flex-start',
            }}
          />
          <MembershipTable memberships={memberships} />
        </div>
      )}
    </Modal>
  )
}
