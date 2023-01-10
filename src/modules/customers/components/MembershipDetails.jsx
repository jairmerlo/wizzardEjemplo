import { Descriptions, Segmented } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms } from '.'

export const MembershipDetails = () => {
  const { membershipId } = useParams()
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
          <AuthorizationForms dataSource={[]} />
        )}
      </div>
    </div>
  )
}
