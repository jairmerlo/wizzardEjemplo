import { Button, Descriptions, Popover, Segmented, Space, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms, IdxRequest, LaunchWebsite, ProductPurchasedTimeline } from '.'
import { useGetMembershipQuery } from '../../../app/api/backoffice'
import { useGetAuthorizationFormsQuery, useGetRequestByregKeyQuery } from '../../../app/api/billing'
import { Loader } from '../../../components'
import { getConfig, stringAvatar, stringFallback } from '../../../helpers'
import { AgentsMembership } from './AgentsMembership'
import { AgreementHistory } from './AgreementHistory'
import { BillinHistory } from './BillinHistory'
import { BillinInformation } from './BillinInformation'
import { MembershipsTableTrialCustomer } from './MembershipsTableTrialCustomer'
import { TheamMembership } from './TheamMembership'
import '../../../icons/style.css'
import { Actions, BillingEnrollment, Deleteicon, EditMemberhipIcon, Requesticon } from '../../memberships/components'

export const MembershipDetails = () => {
  const { membershipRegKey } = useParams()
  let options = [
    'Billing Information',
    'Billing History',
    'Authorization Forms',
    'Agreements',
    'Team',
    'Product Timeline'
    // 'IDX Request'
    // 'Launch Website'
    // 'Agents',
    // 'Membership Trial',
  ]

  // const { data: billinHistoryData = [] } = useListAccountInvoiceByRegkeyQuery(
  //   { registration_key: membershipRegKey },
  //   {
  //     skip: !membershipRegKey,
  //   },
  // )

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const { data: membershipData = {}, isLoading: isLoadingM } = useGetMembershipQuery(
    { registration_key: membershipRegKey },
    {
      skip: !membershipRegKey,
    },
  )

  console.log({ membershipData })

  const {
    hasCrm = 0,
    hasTrial = 0,
    hasLaunch = 0,
    showIdx = 0,
    idx = false,
    boardName = "N/A",
    cycleBillingType = 1,
    cpanelRegistrationKey = '',
    cpanelId = '',
    membershipId = ''
  } = membershipData

  // console.log({ membershipData })
  // console.log(membershipData?.hasCrm, membershipData?.hasTrial, "variables")
  if (hasCrm === "1") options.push("Agents")
  if (hasTrial === 1) options.push("Membership Trial")
  if (hasLaunch === 1) options.push("Launch Website")

  const { data: dataRegistration = [] } = useGetRequestByregKeyQuery({
    registration_key: membershipRegKey
  })
  if (showIdx) {
    if (dataRegistration[0]?.status === "Done") {
      options.push("IDX Request Approved")
    } else {
      options.push("IDX Request")
    }
  }
  // const idUser = membershipData?.customerId.split('0').slice(-1)
  // console.log({ membershipData })


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
  let fullName = membershipData?.firstName
  if (membershipData?.lastName !== null) {
    fullName = fullName + ' ' + membershipData?.lastName
  }
  if (isLoadingM) return <Loader />

  // console.log(window.isAch, "isAch")
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Typography.Title level={5} style={{ margin: 0 }}>
          Membership View
        </Typography.Title>
        <Button
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: '#858faf',
            fontSize: '10px',
            border: 'none',
            backgroundColor: 'transparent',
          }}
          onClick={handleOpen}
        >
          <span className='back-office-tools' style={{ fontSize: '30px' }}></span>
          TOOLBOX
        </Button>
      </div>
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
          <Descriptions.Item label='Customer'>
            {stringFallback(fullName)}
          </Descriptions.Item>
          {/* <Descriptions.Item>
          </Descriptions.Item> */}
          <Descriptions.Item>

          </Descriptions.Item>
          <Descriptions.Item label='Project Name'>
            {stringFallback(membershipData?.projectName)}
          </Descriptions.Item>
          {
            boardName === "N/A" ?
              (
                <Descriptions.Item>

                </Descriptions.Item>
              )
              : (
                <Descriptions.Item label='Board name'>
                  {stringFallback(membershipData?.boardName)}
                </Descriptions.Item>
              )
          }
          <Descriptions.Item label='URL'>
            <a
              href={membershipData?.wordpressInstallUrl}
              target='_blank'
              rel='noreferrer'
            >
              {membershipData?.wordpressInstallUrl}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Published Date'>
            {stringFallback(membershipData?.activatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label='Service/Product'>
            {stringFallback(membershipData?.classAccountingName)}
          </Descriptions.Item>
          <Descriptions.Item label='Initial Billing Date'>
            {stringFallback(membershipData?.initBillingDate)}
          </Descriptions.Item>
          <Descriptions.Item label='Program $'>
            {stringFallback(membershipData?.price)}
          </Descriptions.Item>
          <Descriptions.Item label='Billing Cycle'>
            {stringFallback(membershipData?.billingCicle)}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {stringFallback(
              membershipData?.createdAt
            )}
          </Descriptions.Item>
          <Descriptions.Item label='Last Payment'>
            {stringFallback(membershipData.lastPayment)}
          </Descriptions.Item>
          {/* <Descriptions.Item label='$ Lifetime'>
            {stringFallback(membershipData?.amount)}
          </Descriptions.Item> */}
          {hasTrial ? (
            <Descriptions.Item label='Trial Due'>
              {membershipData.trialDue ? stringFallback(membershipData.trialDue) : 'No'}
            </Descriptions.Item>
          ) :
            (
              <Descriptions.Item>
              </Descriptions.Item>
            )
          }

          <Descriptions.Item label='Next Payment'>
            {stringFallback(membershipData.nextPayment)}
          </Descriptions.Item>
          <Descriptions.Item>
          </Descriptions.Item>
          <Descriptions.Item label='Payment Due'>
            {stringFallback(membershipData.paymentDue)}
          </Descriptions.Item>


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
            // console.log(section)
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
            key={0}
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              // console.log('llama')
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Billing History' && (
          <BillinHistory
            key={1}
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              // console.log('llama')
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Agreements' && (
          <AgreementHistory
            key={2}
            cardData={authorizationFormsCard}
            achData={authorizationFormsACH}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
            onSuccess={() => {
              // console.log('llama')
              refetchACH()
              refetchCard()
            }}
          />
        )}
        {section === 'Team' && (
          <TheamMembership
            key={3}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
          />
        )}
        {section === 'Agents' && (
          <AgentsMembership
            key={4}
            userId={getConfig().userId}
            registrationKey={membershipRegKey}
          />
        )}
        {section === 'Authorization Forms' && (
          <AuthorizationForms
            key={5}
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
        {section === 'Launch Website' && (
          <LaunchWebsite
            key={6}
            registrationKey={membershipRegKey}
          />
        )}
        {section === 'Membership Trial' && (
          <MembershipsTableTrialCustomer
            key={7}
            customerId={membershipData.customerId}
            registrationKey={membershipRegKey}
          />
        )}
        {(section === 'IDX Request' || section === 'IDX Request Approved') && (
          <IdxRequest
            key={8}
            registration_key={membershipRegKey}
          />
        )}
        {section === 'Product Timeline' && (
          <ProductPurchasedTimeline
            key={9}
            registration_key={membershipRegKey}
          />
        )}
      </div>

      <Actions
        open={open}
        handleClose={handleClose}
        currentId={cpanelId}
        currentRegKey={cpanelRegistrationKey}
        membershipID={membershipId}
        billingCicle={cycleBillingType}
      />
    </div>
  )
}
