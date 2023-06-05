import { Button, Card, Segmented, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Link, useParams } from 'react-router-dom'
import { useGetCustomerQuery } from '../../../app/api/billing'
import { ErrorHandler } from '../../../components'
import { date, stringAvatar, stringFallback } from '../../../helpers'
import { useState } from 'react'
import { BillingHistoryTable, MembershipTable, QuotesTable } from '.'

export const CustomerViewChild = () => {
  const { customerId } = useParams()
  const [table, setTable] = useState('Membership')
  const { data = {}, isLoading } = useGetCustomerQuery(customerId)
  // console.log({ data }, "data")
  const {
    name,
    last_name,
    phone,
    email_contact,
    street1,
    state,
    created_on,
    memberships,
    quotes = [],
    invoices = [],
    uuid,
  } = data
  const fullName = name + ' ' + last_name
  const isError = Array.isArray(data) || Object.keys(data).length === 0
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
    <>
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
            <div
              style={{
                ...stringAvatar(fullName).style,
                height: '200px',
                width: '200px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              children={
                <>
                  <p
                    style={{
                      margin: 0,
                    }}
                  >
                    {stringAvatar(fullName).children}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '24px',
                    }}
                  >
                    {uuid}
                  </p>
                </>
              }
            />
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
              <Card.Grid style={gridStyle}>{`Since ${date(
                created_on,
              )}`}</Card.Grid>
            </Card>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Segmented
              options={['Membership', 'Billing History', 'Quotes']}
              style={{
                alignSelf: 'flex-start',
              }}
              value={table}
              onChange={setTable}
            />
            <Link to={`/new-quote?customerId=${customerId}`}>
              <Button type='primary'>Add Quote</Button>
            </Link>
          </div>
          {table === 'Membership' && (
            <MembershipTable memberships={memberships} />
          )}
          {table === 'Billing History' && <BillingHistoryTable dataSource={invoices} customerId={customerId} />}
          {table === 'Quotes' && <QuotesTable dataSource={quotes} />}
        </div>
      )}
    </>
  )
}
