import { Descriptions, Segmented, Typography } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms } from '.'
import { useGetMembershipQuery } from '../../../app/api/backoffice'
import { useGetAuthorizationFormsQuery } from '../../../app/api/billing'
import { Loader } from '../../../components'
import { getConfig, stringAvatar, stringFallback, date } from '../../../helpers'
import { AgentsMembership } from './AgentsMembership'
import { AgreementHistory } from './AgreementHistory'
import { BillinHistory } from './BillinHistory'
import { BillinInformation } from './BillinInformation'
import { MembershipsTableTrialCustomer } from './MembershipsTableTrialCustomer'
import { TheamMembership } from './TheamMembership'

export const MembershipDetails = () => {
  const { membershipRegKey } = useParams()

  const [tialCount, setTrialCount] = useState(0)

  let options = [
    'Billing Information',
    'Billing History',
    'Authorization Forms',
    'Agreements',
    'Team',
    // 'Agents',
    // 'Membership Trial',
  ]

  const { data: membershipData, isLoading: isLoadingM } = useGetMembershipQuery(
    { registration_key: membershipRegKey },
    {
      skip: !membershipRegKey,
    },
  )

  const crm = membershipData?.hasCrm
  const trial = membershipData?.hasTrial
  console.log(trial, "trial")

  // console.log(membershipData?.hasCrm, membershipData?.hasTrial, "variables")

  if (crm == 1) options.push("Agents")

  if (trial == 1) options.push("Membership Trial")


  const { data: authorizationFormsACH = [], refetch: refetchACH } =
    useGetAuthorizationFormsQuery(
      {
        registration_key: membershipRegKey,
        authorization_form_type: 'ACH',
        order: 'id desc',
      },
      {
        skip: !membershipRegKey,
      },
    )

  const { data: authorizationFormsCard = [], refetch: refetchCard } =
    useGetAuthorizationFormsQuery(
      {
        registration_key: membershipRegKey,
        authorization_form_type: 'Card',
        order: 'id desc',
      },
      {
        skip: !membershipRegKey,
      },
    )
  const [section, setSection] = useState('Billing Information')
  const fullName = membershipData?.firstName + ' ' + membershipData?.lastName
  if (isLoadingM) return <Loader />

  console.log({ membershipData })
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
                {membershipData?.membershipId}
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
          <Descriptions.Item label='URL'>
            <a
              href={membershipData?.wordpressInstallUrl}
              target='_blank'
              rel='noreferrer'
            >
              {membershipData?.wordpressInstallUrl}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Published'>
            {stringFallback(membershipData?.activatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label='Service/Product'>
            {stringFallback(membershipData?.classAccountingName)}
          </Descriptions.Item>
          <Descriptions.Item label='Board'>
            {stringFallback(membershipData.boardName)}
          </Descriptions.Item>
          <Descriptions.Item label='Customer'>
            {stringFallback(fullName)}
          </Descriptions.Item>
          <Descriptions.Item label='IDX'>
            {stringFallback(membershipData.idx)}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {stringFallback(
              date(membershipData?.createdAt, 'MM/DD/YYYY', 'll'),
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Premium Date'>
            {stringFallback(membershipData.premium)}
          </Descriptions.Item>
          <Descriptions.Item label='$ Setup Fee/ 1st Payment'>
            {stringFallback(membershipData?.setUpFee)}
          </Descriptions.Item>
          <Descriptions.Item label='Premium'>
            {stringFallback(
              membershipData.hasPremium === true ? 'Yes' : 'No',
            )}
          </Descriptions.Item>
          <Descriptions.Item label='$ Price'>
            {stringFallback(membershipData?.price)}
          </Descriptions.Item>
          <Descriptions.Item label='IDX Requested' span={2}>
            {stringFallback(
              date(membershipData.idxRequestedDate, 'MM/DD/YYYY', 'll'),
            )}
          </Descriptions.Item>
          <Descriptions.Item label='$ Lifetime'>
            {stringFallback(membershipData?.amount)}
          </Descriptions.Item>
          {(trial != undefined && trial != 0) && (
            <>
              <Descriptions.Item label='Trial Due'>
                {stringFallback(
                  date(membershipData.trialDue, 'MM/DD/YYYY', 'll'),
                )}
              </Descriptions.Item>
            </>
          )}

          {!membershipData?.hasTrial && (
            <>
              <Descriptions.Item label='Periods'>
                {stringFallback(membershipData?.periods)}
              </Descriptions.Item>
              <Descriptions.Item label='Last Payment'>
                {stringFallback(membershipData?.lastPayment)}
              </Descriptions.Item>
            </>
          )}

          {/* <Descriptions.Item label='Balance'>
                -------
              </Descriptions.Item> */}


        </Descriptions>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Segmented
          options={options}
          size='large'
          style={{
            alignSelf: 'flex-start',
          }}
          value={section}
          onChange={section => {
            console.log(section)
            setSection(section)
            if (
              section === 'Authorization Forms' ||
              section === 'Billing Information'
            ) {
              refetchACH()
              refetchCard()
            }
          }}
        />
        {section === 'Billing Information' && (
          <BillinInformation
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              console.log('llama')
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Billing History' && (
          <BillinHistory
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              console.log('llama')
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Agreements' && (
          <AgreementHistory
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              console.log('llama')
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Team' && (
          <TheamMembership
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
          />
        )}
        {section === 'Agents' && (
          <AgentsMembership
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
          />
        )}
        {section === 'Authorization Forms' && (
          <AuthorizationForms
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Membership Trial' && (
          <MembershipsTableTrialCustomer
            customerId={membershipData.customerId}
          />
        )}
      </div>
    </div>
  )
}
