import { Avatar, Descriptions, Segmented, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms } from '.'
import { useGetMembershipQuery } from '../../../app/api/backoffice'
import {
  useGetAuthorizationFormsQuery,
  useGetCustomerQuery,
} from '../../../app/api/billing'
import { getConfig, stringAvatar, stringFallback } from '../../../helpers'
import { BillinInformation } from './BillinInformation'

export const MembershipDetails = () => {
  const { membershipId, customerId } = useParams()
  const { data: customer = {}, isLoading } = useGetCustomerQuery(customerId)
  const { memberships = [] } = customer

  const membership = memberships.find(item => item.id === membershipId)

  const { data: membershipData, isLoading: isLoadingM } = useGetMembershipQuery(
    { registration_key: membership?.registration_key },
    {
      skip: !membership,
    },
  )

  console.info('membershipDataaaaa', membershipData)

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
  if (isLoading || isLoadingM) return 'Cargando...'
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Typography.Title level={5} style={{ margin: 0 }}>
        Membership View
      </Typography.Title>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          backgroundColor: 'rgb(128 128 128 / 6%)',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            ...stringAvatar(fullName).style,
            width: '200px',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            borderTopLeftRadius: '12px',
            borderBottomLeftRadius: '12px',
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
            margin: '10px',
          }}
          // extra={<Button type='primary'>Edit</Button>}
        >
          <Descriptions.Item label='URL' span={2}>
            <a
              href={membershipData?.wordpressInstallUrl}
              target='_blank'
              rel='noreferrer'
            >
              {membershipData?.wordpressInstallUrl}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Service/Product' span={2}>
            {stringFallback(membershipData.classAccountingName)}
          </Descriptions.Item>
          <Descriptions.Item label='Customer' span={2}>
            {stringFallback(fullName)}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {stringFallback(membershipData.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label='Published'>
            {stringFallback(membershipData.activatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label='$ Price'>
            {stringFallback(membershipData.price)}
          </Descriptions.Item>
          <Descriptions.Item label='$ Lifetime'>
            {stringFallback(membershipData.amount)}
          </Descriptions.Item>

          {!membershipData.hasTrial && (
            <>
              <Descriptions.Item label='Periods'>
                {stringFallback(membershipData.periods)}
              </Descriptions.Item>
              <Descriptions.Item label='Last Payment'>
                {stringFallback(membershipData.lastPayment)}
              </Descriptions.Item>
            </>
          )}

          {/* trial information */}
          {membershipData.hasTrial && (
            <>
              <Descriptions.Item label='Trial Due'>
                {stringFallback(membershipData.trialDue)}
              </Descriptions.Item>
              <Descriptions.Item label='Board'>
                  {stringFallback(membershipData.boardName)}
              </Descriptions.Item>
              <Descriptions.Item label='IDX Requested'>
                {stringFallback(membershipData.idxRequestedDate)}
              </Descriptions.Item>
              {/* <Descriptions.Item label='Balance'>
                -------
              </Descriptions.Item> */}
              <Descriptions.Item label='IDX'>
                {stringFallback(membershipData.idx)}
              </Descriptions.Item>             
              <Descriptions.Item label='Premium'>
                {stringFallback(membershipData.hasPremium === true ? 'Yes' : 'No' )}
              </Descriptions.Item>
               <Descriptions.Item label='Premium Date'>
                {stringFallback(membershipData.premium)}
              </Descriptions.Item>
             
            </>
          )}
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
        {section === 'Billing Information' && (
          <BillinInformation
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
