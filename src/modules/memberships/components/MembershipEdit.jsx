import { EditTwoTone, ExclamationCircleFilled } from '@ant-design/icons'
import {
  Button,
  Divider,
  Modal,
  Spin,
  Tooltip,
  Tree,
  Typography,
  Form,
  Input,
  Select as AntdSelect,
  notification,
} from 'antd'
import { Input as FormikInput, Select, Checkbox } from 'formik-antd'
import { ErrorMessage, Formik } from 'formik'
import { useEffect, useMemo, useState } from 'react'
import { useCss } from 'react-use'
import {
  useEditMembershipMutation,
  useGetMembershipQuery,
  useGetTheamProfilesQuery,
} from '../../../app/api/backoffice'
import { useGetAllCustomersQuery } from '../../../app/api/billing'
import { boolean, getConfig, getSelectSearchProps } from '../../../helpers'
import moment from 'moment'
import * as Yup from 'yup'
const treeData = [
  {
    title: 'Has CMS Team',
    key: 'hasCmsTeam',
  },
  {
    title: 'Property Sites',
    key: 'hasSpw',
  },
  {
    title: 'Has Cms Blog',
    key: 'hasCmsBlog',
  },
]

const treeDataIDX = [
  {
    title: 'Map Search Filters',
    key: 'isSearchFilter',
  },
  {
    title: 'Display Filters',
    key: 'displayFilters',
  },
  {
    title: 'My Buildings',
    key: 'hasBuilding',
  },
  {
    title: 'Commercial Filters',
    key: 'hasCommercialListing',
  },
  {
    title: 'Dynamic Remarketing',
    key: 'hasDynamicRemarketing',
  },
]

const treeHasVacationRentals = [
  { title: "Listing Agent's CC Email", key: 'listingAgent' },
  {
    title: 'Has Home Page Vacation Rentals Quick Search',
    key: 'hasRentalsQuickSearch',
  },
]

const treeLeadGeneration = [
  {
    title: 'Boost Conversion Tool',
    key: 'hasRegistrationSettings',
  },
  {
    title: 'Boost Nurture',
    key: 'smartPropertyAlert',
  },
  {
    title: 'IDXBoost Box Ads',
    key: 'boostBox',
  },
  {
    title: 'Cms Landing / Forms',
    key: 'hasCmsForm',
  },
]

const data = [
  'hasCmsTeam',
  'hasSpw',
  'hasCmsBlog',
  'isSearchFilter',
  'displayFilters',
  'hasBuilding',
  'hasCommercialListing',
  'hasDynamicRemarketing',
  'listingAgent',
  'hasRentalsQuickSearch',
  'hasRegistrationSettings',
  'smartPropertyAlert',
  'boostBox',
  'hasCmsForm',
  'userShowQuizz',
  'hasSms',
  'leadAutoCreated',
  'hasAlerts',
  'hasGenerateSchema',
  'hasCms',
  'marketing',
  'hasBasicIdx',
  'hasVacationRentals',
]

const treeOthers = [
  {
    title: 'Quiz After Registration',
    key: 'userShowQuizz',
  },
  {
    title: 'SMS',
    key: 'hasSms',
  },
  {
    title: 'Hot Sheet Autocreate User',
    key: 'leadAutoCreated',
  },
  {
    title: 'Alerts',
    key: 'hasAlerts',
  },
  {
    title: 'Generate Schema',
    key: 'hasGenerateSchema',
  },
]

export const MembershipEdit = ({
  registration_key,
  open,
  onClose = f => f,
}) => {
  const { confirm } = Modal
  const form = useCss({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '16px',
    rowGap: '30px',
    '& > .ant-form-item': {
      margin: '0px',
    },
    '@media only screen and (max-width: 745px)': {
      gridTemplateColumns: '1fr',
    },
  })

  const { data: { data: theamProfiles = {} } = {} } = useGetTheamProfilesQuery(
    undefined,
    {
      skip: !open,
    },
  )
  const {
    profile_deployment = [],
    profile_marketing = [],
    profile_project_manager = [],
  } = theamProfiles
  console.log({ theamProfiles })
  const { data: customers = [] } = useGetAllCustomersQuery(
    {},
    {
      skip: !open,
    },
  )
  console.log({ customers })
  const customersOptions = useMemo(
    () =>
      customers.map(({ user_name, email_contact, uuid }) => ({
        label: `${user_name} (${email_contact})`,
        value: uuid,
      })),
    [customers.length],
  )

  const { data = {}, isLoading } = useGetMembershipQuery(
    { registration_key },
    {
      skip: !open,
    },
  )
  const noData = 'No data'
  console.log({ data })
  const [
    editMembership,
    { isLoading: isLoadingEdit, isSuccess, data: response },
  ] = useEditMembershipMutation()
  useEffect(() => {
    if (isSuccess) {
      onClose()
      notification.success({
        message: `Success`,
        description: response?.message,
        placement: 'bottomRight',
      })
    }
  }, [isSuccess])

  const {
    cpanelUsername = noData,
    companyName = noData,
    templateName = noData,
    wordpressInstallName = noData,
    wordpressUsername = noData,
    originalWordpressInstallUrl = noData,
    wordpressInstallUrl = noData,
    cpanelRegistrationKey = noData,
    ipConfig = noData,
    googleRecaptcha = noData, // public
    googleMapsApiKey = noData,
    googleRecaptchaExtraKey = noData, // private
    profileDeployment = [],
    profileMarketing = [],
    profileProjectManager = [],
    customerId = noData,
    dataStudioUrl = noData,
    validateRegistration = noData,
    forceRegistration = noData,
    forceRegistrationForced = noData,
    sinUpLeftClick = noData,
    membershipId = noData,
    activatedAt = noData,
    isProductionMode = noData,
    hasCmsTeam = '0',
    hasSpw = '0',
    hasCmsBlog = '0',
    isSearchFilter = '0',
    displayFilters = '0',
    hasBuilding = '0',
    hasCommercialListing = '0',
    hasDynamicRemarketing = '0',
    listingAgent = '0',
    hasRentalsQuickSearch = '0',
    hasRegistrationSettings = '0',
    smartPropertyAlert = '0',
    boostBox = '0',
    hasCmsForm = '0',
    userShowQuizz = '0',
    hasSms = '0',
    leadAutoCreated = '0',
    hasAlerts = '0',
    hasGenerateSchema = '0',
    hasCms = '0',
    marketing = '0',
    hasBasicIdx = '0',
    hasVacationRentals = '0',
    id,
  } = data
  const [editPassword, setEditPassword] = useState(false)
  const onCheck = (checkedKeys, setFieldValue) => {
    const keys = Object.fromEntries(checkedKeys.map(item => [item, true]))
    for (const property in keys) {
      setFieldValue(property, keys[property])
    }
    console.log('onCheck', keys)
  }

  return (
    <>
      <Modal
        title={`Membership ID: ${membershipId}`}
        open={open}
        //   onOk={handleOk}
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
        onCancel={onClose}
        width={800}
        centered
        destroyOnClose
      >
        <Divider />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin tip='Loading' size='large' />
          </div>
        ) : (
          <Formik
            enableReinitialize
            onSubmit={values => {
              const {
                cpanelUsername,
                companyName,
                templateName,
                wordpressUsername,
                wordpressInstallName,
                originalWordpressInstallUrl,
                cpanelRegistrationKey,
                ...rest
              } = values
              const publicationDate = moment(
                moment(rest.activatedAt, 'YYYY-MM-DD'),
              ).format('MM/DD/YYYY')

              const body = {
                ...rest,
                activatedAt:
                  publicationDate !== 'Invalid date' ? publicationDate : null,
              }
              if (editPassword) {
                editMembership([{ id, username: getConfig().userId }, body])
                console.log({ body })
              } else {
                delete body.cpanelPassword
                editMembership([{ id, username: getConfig().userId }, body])
                console.log({ body })
              }
            }}
            initialValues={{
              customerId,
              cpanelUsername,
              companyName,
              templateName,
              wordpressUsername,
              wordpressInstallName,
              originalWordpressInstallUrl,
              wordpressInstallUrl,
              cpanelRegistrationKey,
              ipConfig: ipConfig === null ? '' : ipConfig,
              googleRecaptcha,
              googleMapsApiKey,
              googleRecaptchaExtraKey,
              profileDeployment,
              profileMarketing,
              profileProjectManager,
              dataStudioUrl,
              validateRegistration: boolean(validateRegistration),
              isProductionMode: boolean(isProductionMode),
              forceRegistration: boolean(forceRegistration),
              forceRegistrationForced,
              sinUpLeftClick,
              activatedAt: moment(moment(activatedAt, 'MM/DD/YYYY')).format(
                'YYYY-MM-DD',
              ),
              hasCmsTeam: boolean(hasCmsTeam),
              hasSpw: boolean(hasSpw),
              hasCmsBlog: boolean(hasCmsBlog),
              isSearchFilter: boolean(isSearchFilter),
              displayFilters: boolean(displayFilters),
              hasBuilding: boolean(hasBuilding),
              hasCommercialListing: boolean(hasCommercialListing),
              hasDynamicRemarketing: boolean(hasDynamicRemarketing),
              listingAgent: boolean(listingAgent),
              hasRentalsQuickSearch: boolean(hasRentalsQuickSearch),
              hasRegistrationSettings: boolean(hasRegistrationSettings),
              smartPropertyAlert: boolean(smartPropertyAlert),
              boostBox: boolean(boostBox),
              hasCmsForm: boolean(hasCmsForm),
              userShowQuizz: boolean(userShowQuizz),
              hasSms: boolean(hasSms),
              leadAutoCreated: boolean(leadAutoCreated),
              hasAlerts: boolean(hasAlerts),
              hasGenerateSchema: boolean(hasGenerateSchema),
              hasCms: boolean(hasCms),
              marketing: boolean(marketing),
              hasBasicIdx: boolean(hasBasicIdx),
              hasVacationRentals: boolean(hasVacationRentals),
              cpanelPassword: '',
            }}
            validationSchema={Yup.object({
              cpanelPassword: editPassword
                ? Yup.string()
                    .required('Password is required')
                    .min(8, 'Password must contain 8 or more characters')
                : undefined,
              ipConfig: Yup.string().matches(
                /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                'Is not valid IP',
              ),
            })}
          >
            {({ errors, touched, handleSubmit, setFieldValue, values }) => (
              <>
                <Form layout='vertical' autoComplete='off'>
                  <Typography.Title level={5}>
                    Installation Properties
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item label='Company Template'>
                      <FormikInput
                        name='companyName'
                        placeholder='Company Template'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label='Template Name'>
                      <FormikInput
                        name='templateName'
                        placeholder='Template Name'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label='Cpanel Username'>
                      <FormikInput
                        name='cpanelUsername'
                        placeholder='Cpanel Username'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label='Cpanel Password'
                      required={editPassword}
                      validateStatus={
                        errors.cpanelPassword &&
                        touched.cpanelPassword &&
                        'error'
                      }
                      help={<ErrorMessage name='cpanelPassword' />}
                    >
                      <Input.Group compact>
                        <FormikInput
                          name='cpanelPassword'
                          style={{ width: 'calc(100% - 31px)' }}
                          placeholder='**********'
                          type='password'
                          disabled={!editPassword}
                        />
                        <Button
                          icon={<EditTwoTone />}
                          onClick={() => {
                            confirm({
                              title:
                                "Are you sure you want to update the user's password? Old password will be removed",
                              icon: <ExclamationCircleFilled />,
                              onOk: () => setEditPassword(true),
                            })
                          }}
                        />
                      </Input.Group>
                    </Form.Item>
                    <Form.Item label='WordPress Install Name'>
                      <FormikInput
                        name='wordpressInstallName'
                        placeholder='WordPress Install Name'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label='WordPress Username'>
                      <FormikInput
                        name='wordpressUsername'
                        placeholder='WordPress Username'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label='Original WordPress URL'>
                      <FormikInput
                        name='originalWordpressInstallUrl'
                        placeholder='Original WordPress URL'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item label='WordPress URL'>
                      <FormikInput
                        name='wordpressInstallUrl'
                        placeholder='WordPress URL'
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <Typography.Title level={5} style={{ marginTop: '24px' }}>
                    Membership's Properties
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item label='Cpanel Registration Key'>
                      <FormikInput
                        name='cpanelRegistrationKey'
                        placeholder='Cpanel Registration Key'
                        disabled
                      />
                    </Form.Item>
                    <Form.Item
                      label='IP Configuration'
                      validateStatus={
                        errors.ipConfig && touched.ipConfig && 'error'
                      }
                      help={<ErrorMessage name='ipConfig' />}
                    >
                      <FormikInput
                        name='ipConfig'
                        placeholder='xxx.xxx.xxx.xx'
                        pattern='^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
                      />
                    </Form.Item>
                    <Form.Item label='Customer'>
                      <Select
                        name='customerId'
                        options={customersOptions}
                        {...getSelectSearchProps()}
                      />
                    </Form.Item>
                    <Form.Item label='Publication Date'>
                      <FormikInput
                        name='activatedAt'
                        placeholder='Publication Date'
                        type='date'
                      />
                      <Checkbox name='isProductionMode'>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Production Mode
                        </span>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item label='Google Recaptcha Public Key'>
                      <FormikInput
                        disabled
                        name='googleRecaptcha'
                        placeholder='Google Recaptcha Public Key'
                      />
                    </Form.Item>
                    <Form.Item label='Google Maps API Key'>
                      <FormikInput
                        disabled
                        name='googleMapsApiKey'
                        placeholder='Google Maps API Key'
                      />
                    </Form.Item>
                    <Form.Item label='Google Recaptcha Private Key'>
                      <FormikInput
                        disabled
                        name='googleRecaptchaExtraKey'
                        placeholder='Google Recaptcha Private Key'
                      />
                    </Form.Item>
                    <div></div>
                    <Form.Item label='Data Studio URL'>
                      <FormikInput
                        name='dataStudioUrl'
                        placeholder='Data Studio URL'
                      />
                    </Form.Item>
                    <Form.Item label='Validate Registration'>
                      <Checkbox name='validateRegistration'>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Validate Registration
                        </span>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item label='Force Registration'>
                      <Checkbox name='forceRegistration'>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Force Registration
                        </span>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item label='Force Registration Forced'>
                      <Select
                        name='forceRegistrationForced'
                        placeholder='Force Registration Forced'
                        options={[
                          { label: 'Soft', value: '0' },
                          { label: 'Forced', value: '1' },
                        ]}
                        {...getSelectSearchProps()}
                      />
                    </Form.Item>
                    <Form.Item label='Open Registration After'>
                      <Select
                        name='sinUpLeftClick'
                        placeholder='Open Registration After'
                        options={Array.from(Array(10).keys()).map(value => ({
                          label: `${value + 1}`,
                          value: `${value + 1}`,
                        }))}
                        {...getSelectSearchProps()}
                      />
                    </Form.Item>
                  </div>
                  <Typography.Title level={5} style={{ marginTop: '24px' }}>
                    Membership's Team{' '}
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item label='Profile Deployment Team'>
                      <Select
                        mode='multiple'
                        name='profileDeployment'
                        options={profile_deployment}
                        {...getSelectSearchProps()}
                      />
                    </Form.Item>
                    <Form.Item label='Profile Marketing Team'>
                      <Select
                        mode='multiple'
                        name='profileMarketing'
                        options={profile_marketing}
                        {...getSelectSearchProps()}
                      />
                    </Form.Item>
                    <Form.Item label='Profile Project Manager Team'>
                      <AntdSelect
                        mode='multiple'
                        name='profileProjectManager'
                        options={profile_project_manager}
                        value={values.profileProjectManager}
                        onChange={value => {
                          setFieldValue('profileProjectManager', value)
                        }}
                        {...getSelectSearchProps()}
                      />
                    </Form.Item>
                  </div>
                  <Typography.Title level={5} style={{ marginTop: '24px' }}>
                    User Properties
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '0px' }}>
                    <div>
                      <Checkbox
                        name='hasCms'
                        style={{
                          marginLeft: '24px',
                          marginBottom: '4px',
                        }}
                      >
                        Website Builder
                      </Checkbox>
                      {values.hasCms && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {treeData.map(item => (
                            <Checkbox
                              name={item.key}
                              style={{
                                marginLeft: '24px',
                                marginBottom: '4px',
                              }}
                            >
                              {item.title}
                            </Checkbox>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <Checkbox
                        name='marketing'
                        style={{
                          marginLeft: '24px',
                          marginBottom: '4px',
                        }}
                      >
                        Lead Generation
                      </Checkbox>
                      {values.marketing && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {treeLeadGeneration.map(item => (
                            <Checkbox
                              name={item.key}
                              style={{
                                marginLeft: '24px',
                                marginBottom: '4px',
                              }}
                            >
                              {item.title}
                            </Checkbox>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <Checkbox
                        name='hasBasicIdx'
                        style={{
                          marginLeft: '24px',
                          marginBottom: '4px',
                        }}
                      >
                        IDX Integration
                      </Checkbox>
                      {values.hasBasicIdx && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {treeDataIDX.map(item => (
                            <Checkbox
                              name={item.key}
                              style={{
                                marginLeft: '24px',
                                marginBottom: '4px',
                              }}
                            >
                              {item.title}
                            </Checkbox>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <Checkbox
                        name='hasVacationRentals'
                        style={{
                          marginLeft: '24px',
                          marginBottom: '4px',
                        }}
                      >
                        Has Vacation Rentals
                      </Checkbox>
                      {values.hasVacationRentals && (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                          }}
                        >
                          {treeHasVacationRentals.map(item => (
                            <Checkbox
                              name={item.key}
                              style={{
                                marginLeft: '24px',
                                marginBottom: '4px',
                              }}
                            >
                              {item.title}
                            </Checkbox>
                          ))}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {treeOthers.map(item => (
                        <Checkbox
                          name={item.key}
                          style={{
                            marginLeft: '24px',
                            marginBottom: '4px',
                          }}
                        >
                          {item.title}
                        </Checkbox>
                      ))}
                    </div>
                  </div>
                </Form>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    justifyContent: 'flex-end',
                    paddingTop: '8px',
                  }}
                >
                  <Button onClick={onClose}>Cancel</Button>
                  <Button
                    type='primary'
                    onClick={handleSubmit}
                    loading={isLoadingEdit}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </Formik>
        )}
      </Modal>
    </>
  )
}