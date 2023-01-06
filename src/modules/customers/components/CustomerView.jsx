import { Button, Divider, Typography } from 'antd'
import Modal from 'react-modal'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'

export const CustomerView = () => {
  const navigate = useNavigate()
  const { customerId, membershipId } = useParams()
  Modal.setAppElement('body')
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
          <Link to={`/customer-view/${customerId}`}>Customer View</Link>{' '}
          {membershipId && '/ Membership Details'}
        </Typography.Title>
        <div style={{ flexGrow: 1 }} />
        <Link to='/'>
          <Button size='small' danger>
            Back
          </Button>
        </Link>
      </div>
      <Divider />
      <Outlet />
    </Modal>
  )
}
