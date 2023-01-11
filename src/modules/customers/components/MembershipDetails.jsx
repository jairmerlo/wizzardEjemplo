import { Descriptions, Segmented } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms } from '.'
import {
  useGetAuthorizationFormsQuery,
  useGetCustomerQuery,
} from '../../../app/api/billing'
import { getConfig } from '../../../helpers'

export const MembershipDetails = () => {
  const { membershipId, customerId } = useParams()
  const { data: customer = {}, isLoading } = useGetCustomerQuery(customerId)
  const { memberships = [] } = customer
  const membership = memberships.find(item => item.id === membershipId)
  const { data: authorizationFormsACH = [] } = useGetAuthorizationFormsQuery(
    {
      registration_key: membership?.registration_key,
      authorization_form_type: 'ACH',
      order: 'id desc',
    },
    {
      skip: !membership,
    },
  )
  const { data: authorizationFormsCard = [] } = useGetAuthorizationFormsQuery(
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Descriptions
        bordered
        title='Membership View'
        // size={size}
        // extra={<Button type='primary'>Edit</Button>}
      >
        <Descriptions.Item label='Membership ID'>
          {membershipId}
        </Descriptions.Item>
        <Descriptions.Item label='Service Product'>Dominate</Descriptions.Item>
        <Descriptions.Item label='Price'>$100,000</Descriptions.Item>
        <Descriptions.Item label='Public URL'>
          <a>https://...</a>
        </Descriptions.Item>
        <Descriptions.Item label='Customer Owner'>Juan Perez</Descriptions.Item>
        <Descriptions.Item label='Life Time'>...</Descriptions.Item>
        <Descriptions.Item label='Created'>01/06/2023</Descriptions.Item>
        <Descriptions.Item label='Published'>01/06/2023</Descriptions.Item>
        <Descriptions.Item label='Periods'>4</Descriptions.Item>
      </Descriptions>
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
          />
        )}
      </div>
    </div>
  )
}
