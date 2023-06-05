import { Button, Divider, Typography } from 'antd'
import { useSelector } from 'react-redux'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import backoffice from '../../../app/api/backoffice'

export const CustomerView = () => {
  const navigate = useNavigate()
  const { membershipRegKey } = useParams()
  const { data: { customerId } = {} } = useSelector(
    backoffice.endpoints.getMembership.select({
      registration_key: membershipRegKey,
    }),
  )
  console.log({ customerId })
  // const id = customerId.slice('IDX00')
  // console.log({ id })
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
          {customerId ? (
            <Link to={`/customer-view/${customerId}`}>Customer View</Link>
          ) : (
            'Customer View'
          )}{' '}
          {membershipRegKey && '/ Membership Details'}
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
