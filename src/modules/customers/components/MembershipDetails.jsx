import { Descriptions, Popover, Segmented, Space, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms, IdxRequest, LaunchWebsite, ProductPurchasedTimeline } from '.'
import { useGetMembershipQuery } from '../../../app/api/backoffice'
import { useGetAuthorizationFormsQuery, useGetRequestByregKeyQuery, useListAccountInvoiceByRegkeyQuery } from '../../../app/api/billing'
import { Loader } from '../../../components'
import { getConfig, stringAvatar, stringFallback, date } from '../../../helpers'
import { AgentsMembership } from './AgentsMembership'
import { AgreementHistory } from './AgreementHistory'
import { BillinHistory } from './BillinHistory'
import { BillinInformation } from './BillinInformation'
import { MembershipsTableTrialCustomer } from './MembershipsTableTrialCustomer'
import { TheamMembership } from './TheamMembership'
import '../../../icons/style.css'
import { Deleteicon, EditMemberhipIcon, Requesticon } from '../../memberships/components'

export const MembershipDetails = () => {
  const { membershipRegKey } = useParams()

  let options = [
    'Billing Information',
    'Billing History',
    'Authorization Forms',
    'Agreements',
    'Team',
    'Product Purchased Timeline'
    // 'IDX Request'
    // 'Launch Website'
    // 'Agents',
    // 'Membership Trial',
  ]

  const { data: billinHistoryData = [] } = useListAccountInvoiceByRegkeyQuery(
    { registration_key: membershipRegKey },
    {
      skip: !membershipRegKey,
    },
  )

  const { data: membershipData, isLoading: isLoadingM } = useGetMembershipQuery(
    { registration_key: membershipRegKey },
    {
      skip: !membershipRegKey,
    },
  )

  console.log({ membershipData })

  const crm = membershipData?.hasCrm
  const trial = membershipData?.hasTrial
  const launch = membershipData?.hasLaunch
  const idxrequest = membershipData?.idx
  // console.log({ membershipData })
  // console.log(membershipData?.hasCrm, membershipData?.hasTrial, "variables")
  if (crm === "1") options.push("Agents")
  if (trial === 1) options.push("Membership Trial")
  if (launch === 1) options.push("Launch Website")
  const { data: dataRegistration = [], isLoading } = useGetRequestByregKeyQuery({
    registration_key: membershipData?.cpanelRegistrationKey
  })
  if (idxrequest) {
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
        <Popover
          placement='bottom'
          style={{
            cursor: 'pointer'
          }}
          // trigger="hover"
          content={
            <Space size='middle' direction='vertical'>
              <Popover
                // trigger="hover"
                placement='bottom'

                // title={text}
                content={
                  <Space size='middle' direction='vertical'>
                    {/* eslint-disable jsx-a11y/anchor-is-valid */}
                    <Tooltip title='CPanel'>
                      <a href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/cpanel/${membershipData.cpanelId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: '#000',
                            fontSize: '15px'
                          }}
                        >
                          <span className='back-office-rocket' style={{ fontSize: '20px' }}></span>
                          CPanel
                        </div>
                      </a>
                    </Tooltip>

                    <Tooltip title='Wordpress'>
                      <a href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/wordpress/${membershipData.cpanelId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            color: '#000',
                            fontSize: '15px'
                          }}
                        >
                          <span className='back-office-wordpress' style={{ fontSize: '20px' }}></span>
                          Wordpress
                        </div>
                      </a>
                    </Tooltip>


                    {/* <Cpanelicon registration_key={registration_key} /> */}

                    {/* eslint-enable jsx-a11y/anchor-is-valid */}
                  </Space>
                }
                trigger='click'
              >
                <Tooltip title='Login'>
                  <a>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: '#858faf',
                        fontSize: '10px'
                      }}
                    >
                      <span className='back-office-key' style={{ fontSize: '20px' }}></span>
                      LOGIN
                    </div>
                  </a>
                </Tooltip>
              </Popover>

              <Tooltip title='Details'>
                <a
                  href={`${window.location.origin}/customers/v2/customers#/membership-details/${membershipData?.cpanelRegistrationKey}`}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-eye' style={{ fontSize: '20px' }}></span>
                    VIEW
                  </div>
                </a>
              </Tooltip>
              <EditMemberhipIcon registration_key={membershipData?.cpanelRegistrationKey} />

              {/* <SendMembershipicon registration_key={registration_key} /> */}

              <Requesticon registration_key={membershipData?.cpanelRegistrationKey} id={membershipData.cpanelId} />

              <Tooltip title='ONB'>
                <a>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-menu' style={{ fontSize: '20px' }}></span>
                    ONB
                  </div>
                </a>
              </Tooltip>

              <Tooltip title='Accounting classifications'>
                <a href={`${window.location.origin}/accounting/memberships/accounting_classification/${membershipData.cpanelId}`} target='_blank' rel="noreferrer">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#858faf',
                      fontSize: '10px'
                    }}
                  >
                    <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
                    <p style={{ textAlign: 'center' }}>ACCOUNTING
                      <br /> CLASSIFICATIONS</p>
                  </div>
                </a>
              </Tooltip>


              <Deleteicon registration_key={membershipData?.cpanelRegistrationKey} />
              {/* eslint-enable jsx-a11y/anchor-is-valid */}
            </Space>
          }
          trigger='hover'
        >
          <a>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#858faf',
                fontSize: '10px'
              }}
            >
              <span className='back-office-tools' style={{ fontSize: '30px' }}></span>
              TOOLBOX
            </div>
          </a>
        </Popover>
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
          <Descriptions.Item label='URL'>
            <a
              href={membershipData?.wordpressInstallUrl}
              target='_blank'
              rel='noreferrer'
            >
              {membershipData?.wordpressInstallUrl}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label='Periods'>
            {stringFallback(membershipData?.periods)}
          </Descriptions.Item>

          <Descriptions.Item label='Premium'>
            {stringFallback(
              membershipData.hasPremium === true ? 'Yes' : 'No',
            )}
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
            {
              idxrequest ? 'Si' : 'No'
            }
          </Descriptions.Item>
          <Descriptions.Item label='$ Price'>
            {stringFallback(membershipData?.price)}
          </Descriptions.Item>
          <Descriptions.Item label='Premium Date'>
            {stringFallback(membershipData.premium)}
          </Descriptions.Item>
          <Descriptions.Item label='$ Setup Fee/ 1st Payment'>
            {stringFallback(membershipData?.setUpFee)}
          </Descriptions.Item>
          <Descriptions.Item label='Created'>
            {stringFallback(
              membershipData?.createdAt
            )}
          </Descriptions.Item>
          <Descriptions.Item label='$ Lifetime'>
            {stringFallback(membershipData?.amount)}
          </Descriptions.Item>
          {(membershipData?.idxRequestedDate !== null) && (
            <Descriptions.Item label='IDX Requested' span={2}>
              {stringFallback(
                membershipData.idxRequestedDate
              )}
            </Descriptions.Item>
          )}
          {(trial !== '0') && (
            <>
              <Descriptions.Item label='Trial Due'>
                {stringFallback(
                  membershipData.trialDue
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
        {section === 'Launch Website' && (
          <LaunchWebsite
            registrationKey={membershipRegKey}
          />
        )}
        {section === 'Membership Trial' && (
          <MembershipsTableTrialCustomer
            customerId={membershipData.customerId}
          />
        )}
        {(section === 'IDX Request' || section === 'IDX Request Approved') && (
          <IdxRequest
            registration_key={membershipData.cpanelRegistrationKey}
          />
        )}
        {section === 'Product Purchased Timeline' && (
          <ProductPurchasedTimeline
            registration_key={membershipData.cpanelRegistrationKey}
          />
        )}
      </div>
    </div>
  )
}
