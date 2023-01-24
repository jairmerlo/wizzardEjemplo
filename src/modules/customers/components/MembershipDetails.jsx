import { Avatar, Descriptions, Segmented, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms } from '.'
import {
  useGetAuthorizationFormsQuery,
  useGetCustomerQuery,
} from '../../../app/api/billing'
import { getConfig, stringAvatar, stringFallback } from '../../../helpers'

export const MembershipDetails = () => {
  const { membershipId, customerId } = useParams()
  const { data: customer = {}, isLoading } = useGetCustomerQuery(customerId)
  const { memberships = [] } = customer
  const membership = memberships.find(item => item.id === membershipId)
  const { data: authorizationFormsACH = [], refetch: refetchACH } =
    useGetAuthorizationFormsQuery(
      {
        registration_key: membership?.registration_key,
        authorization_form_type: 'ACH',
        order: 'id desc',
      },
      {
        skip: !membership,
      },
    )
  const { data: authorizationFormsCard = [], refetch: refetchCard } =
    useGetAuthorizationFormsQuery(
      {
        registration_key: membership?.registration_key,
        authorization_form_type: 'Card',
        order: 'id desc',
      },
      {
        skip: !membership,
      },
    )
  console.log({ membership })
  const [section, setSection] = useState('Billing Information')
  const fullName = customer.name + ' ' + customer.last_name
  if (isLoading) return 'Cargando...'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        Membership View
      </Typography.Title>
      <div
        style={{
          display: 'flex',
          gap: '16px',
        }}
      >
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
                {membership.membership_id}
              </p>
            </>
          }
        />
        <Descriptions
          // bordered
          size='small'
          column={{
            sm: 2,
            xs: 1,
          }}
          style={{
            width: 'calc(100% - 200px)',
          }}
          // extra={<Button type='primary'>Edit</Button>}
        >
          <Descriptions.Item label='URL' span={2}>
            <a href={membership?.wordpress_install_url} target='_blank'>
              {membership?.wordpress_install_url}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Service/Product' span={2}>
            {stringFallback(membership.accounting_class_name)}
          </Descriptions.Item>
          <Descriptions.Item label='Customer' span={2}>
            {stringFallback(fullName)}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {stringFallback(membership.create_at)}
          </Descriptions.Item>
          <Descriptions.Item label='Published'>
            {/* //todo: determinar */}
            {stringFallback(membership.published)}
          </Descriptions.Item>
          <Descriptions.Item label='Price'>
            {stringFallback(membership.price)}
          </Descriptions.Item>
          <Descriptions.Item label='Life Time'>
            {/* //todo: determinar */}
            {stringFallback(membership.life_time)}
          </Descriptions.Item>
          <Descriptions.Item label='Periods'>
            {stringFallback(membership.periods)}
          </Descriptions.Item>
          <Descriptions.Item label='Last Payment'>
            {stringFallback(membership.last_payment)}
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Segmented
          options={[
            'Billing Information',
            'Billing History',
            'Authorization Forms',
          ]}
          size='large'
          style={{
            alignSelf: 'flex-start',
          }}
          value={section}
          onChange={setSection}
        />
        {section === 'Billing Information' && <div>Billing Information</div>}
        {section === 'Billing History' && <div>Billing History</div>}
        {section === 'Authorization Forms' && (
          <AuthorizationForms
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membership?.registration_key}
            onSuccess={() => {
              refetchACH()
              refetchCard()
            }}
          />
        )}
      </div>
    </div>
  )
}
