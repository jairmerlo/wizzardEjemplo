import { Avatar, Card, Segmented, Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { useParams } from 'react-router-dom'
import { useGetCustomerQuery } from '../../../app/api/billing'
import { ErrorHandler } from '../../../components'
import { stringAvatar, stringFallback } from '../../../helpers'
import { useState } from 'react'
import { BillingHistoryTable, MembershipTable, QuotesTable } from '.'

export const CustomerViewChild = () => {
  const { customerId } = useParams()
  const [table, setTable] = useState('Membership')
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
    quotes = [],
    invoices = [],
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
            value={table}
            onChange={setTable}
          />
          {table === 'Membership' && (
            <MembershipTable memberships={memberships} />
          )}
          {/* //todo: Configurar la tabla quotes */}
          {table === 'Billing' && <BillingHistoryTable dataSource={invoices} />}
          {table === 'Quotes' && <QuotesTable dataSource={quotes} />}
        </div>
      )}
    </>
  )
}
