import { Button, Divider, Typography } from 'antd'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'

export const CustomerView = () => {
  const navigate = useNavigate()
  const { customerId, membershipId } = useParams()
  return (
    <div
      style={{
        padding: '16px',
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
        <Button size='small' danger onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <Divider />
      <Outlet />
    </div>
  )
}
