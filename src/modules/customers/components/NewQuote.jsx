import {
  Button,
  Checkbox,
  Divider,
  Modal,
  notification,
  Typography,
} from 'antd'
import { ErrorMessage, Formik } from 'formik'
import { Select, Input, Form } from 'formik-antd'
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCss } from 'react-use'
import * as Yup from 'yup'
import {
  useCreateProspectMutation,
  useCreateQuoteMutation,
  useGetCustomerQuery,
  useGetNewQuotesOptionsQuery,
} from '../../../app/api/billing'
import { ErrorHandler } from '../../../components'
import {
  capitalize,
  getConfig,
  getSelectSearchProps,
  toTitleCase,
} from '../../../helpers'

function formatUSNumber(entry = '') {
  const match = entry
    .replace(/\D+/g, '')
    .replace(/^1/, '')
    .match(/([^\d]*\d[^\d]*){1,10}$/)[0]
  const part1 = match.length > 2 ? `(${match.substring(0, 3)})` : match
  const part2 = match.length > 3 ? ` ${match.substring(3, 6)}` : ''
  const part3 = match.length > 6 ? `-${match.substring(6, 10)}` : ''
  return `${part1}${part2}${part3}`
}

export const NewQuote = () => {
  const navigate = useNavigate()
  let [searchParams, setSearchParams] = useSearchParams()
  const customerId = searchParams.get('customerId')
  const hasProspect = !customerId
  const openModal = searchParams.get('add') === 'new-prospect' && hasProspect
  const [currentProspect, setCurrentProspect] = useState('')

  const openNotification = () => {
    notification.error({
      message: `Error`,
      description: 'Email already exists.',
      placement: 'bottomRight',
    })
  }
  const [company, setCompany] = useState()
  const { data = {}, refetch } = useGetNewQuotesOptionsQuery({
    company,
    has_trial: hasProspect ? 1 : 0,
  })

  const [
    createProspect,
    { isError: isErrorProspect, isLoading: isLoadingProspect },
  ] = useCreateProspectMutation()
  const [createQuote, { isLoading: isLoadingQuote }] = useCreateQuoteMutation()
  useEffect(() => {
    if (isErrorProspect) {
      openNotification()
    }
  }, [isErrorProspect])

  console.log({ data })
  const {
    quoteId = '',
    prospects = [],
    brokerages = [],
    programs = [],
    boards = [],
    paymentMethods = [],
    coupons = [],
    states = [],
  } = data

  const { data: customer, isError: isErrorGetCustomer } = useGetCustomerQuery(
    customerId,
    {
      skip: hasProspect,
    },
  )
  const [hasIdx, setHasIdx] = useState()
  console.log({ openModal, customerId })
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

  console.log({
    programsHasIdx: programs.filter(item => item.has_idx === true),
  })
  const handleAddProspect = () => {
    setSearchParams({
      add: 'new-prospect',
    })
  }

  const handleCloseProspect = () => {
    setSearchParams({})
  }
  if (isErrorGetCustomer)
    return <ErrorHandler description='The customer does not exist.' />
  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      {openModal && (
        <Modal
          title='New Prospect'
          open={openModal}
          onCancel={handleCloseProspect}
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
        >
          <Formik
            initialValues={{
              name: '',
              last_name: '',
              email: '',
              phone: '',
              street1: '',
              street2: '',
              city: '',
              postal_code: '',
              state: '',
            }}
            enableReinitialize
            onSubmit={(values, helpers) => {
              console.log({ values })
              createProspect(values)
                .then(({ data }) => {
                  if (data.status === 200) {
                    console.log('refetch options')
                    setCurrentProspect(data.data)
                    refetch()
                    handleCloseProspect()
                  }
                })
                .catch(({ data }) => {
                  console.log(data)
                })
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('This field is required.'),
              last_name: Yup.string().required('This field is required.'),
              email: Yup.string()
                .email('Must be a valid email.')
                .required('This field is required.'),
              phone: Yup.string().required('This field is required.'),
            })}
          >
            {({ handleSubmit, errors, touched, setFieldValue }) => (
              <Fragment>
                <Form layout='vertical' autoComplete='off'>
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item
                      label='Name'
                      required
                      validateStatus={errors.name && touched.name && 'error'}
                      help={<ErrorMessage name='name' />}
                    >
                      <Input
                        name='name'
                        placeholder='Name'
                        onChange={e =>
                          setFieldValue(
                            'name',
                            (e.target.value = capitalize(e.target.value)),
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label='Last Name'
                      required
                      validateStatus={
                        errors.last_name && touched.last_name && 'error'
                      }
                      help={<ErrorMessage name='last_name' />}
                    >
                      <Input
                        name='last_name'
                        placeholder='Last Name'
                        onChange={e =>
                          setFieldValue(
                            'last_name',
                            (e.target.value = toTitleCase(e.target.value)),
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label='Email'
                      required
                      validateStatus={errors.email && touched.email && 'error'}
                      help={<ErrorMessage name='email' />}
                    >
                      <Input name='email' placeholder='Email' />
                    </Form.Item>
                    <Form.Item
                      label='Phone'
                      required
                      validateStatus={errors.phone && touched.phone && 'error'}
                      help={<ErrorMessage name='phone' />}
                    >
                      <Input
                        name='phone'
                        placeholder='Phone'
                        onChange={e =>
                          setFieldValue(
                            'phone',
                            (e.target.value = formatUSNumber(e.target.value)),
                          )
                        }
                      />
                    </Form.Item>
                  </div>
                  <div>
                    <Form.Item
                      label='Address'
                      validateStatus={
                        errors.street1 && touched.street1 && 'error'
                      }
                      help={<ErrorMessage name='street1' />}
                    >
                      <Input
                        name='street1'
                        placeholder='Address'
                        onChange={e =>
                          setFieldValue(
                            'street1',
                            (e.target.value = capitalize(e.target.value)),
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label='Address 2'
                      validateStatus={
                        errors.street2 && touched.street2 && 'error'
                      }
                      help={<ErrorMessage name='street2' />}
                    >
                      <Input
                        name='street2'
                        placeholder='Address'
                        onChange={e =>
                          setFieldValue(
                            'street2',
                            (e.target.value = capitalize(e.target.value)),
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label='City'
                      validateStatus={errors.city && touched.city && 'error'}
                      help={<ErrorMessage name='city' />}
                    >
                      <Input
                        name='city'
                        placeholder='City'
                        onChange={e =>
                          setFieldValue(
                            'city',
                            (e.target.value = capitalize(e.target.value)),
                          )
                        }
                      />
                    </Form.Item>
                  </div>
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item
                      label='Zip / Postal Code'
                      validateStatus={
                        errors.postal_code && touched.postal_code && 'error'
                      }
                      help={<ErrorMessage name='postal_code' />}
                    >
                      <Input
                        name='postal_code'
                        type='number'
                        onChange={e =>
                          setFieldValue(
                            'postal_code',
                            (e.target.value = e.target.value.substr(0, 5)),
                          )
                        }
                      />
                    </Form.Item>
                    <Form.Item
                      label='State'
                      validateStatus={errors.state && touched.state && 'error'}
                      help={<ErrorMessage name='state' />}
                    >
                      <Select name='state' options={states} />
                    </Form.Item>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      gap: 8,
                      paddingTop: 30,
                    }}
                  >
                    <Button onClick={handleCloseProspect}>Close</Button>
                    <Button
                      type='primary'
                      onClick={handleSubmit}
                      loading={isLoadingProspect}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </Fragment>
            )}
          </Formik>
        </Modal>
      )}
      <Typography.Title level={4}>New Quotes</Typography.Title>
      <Divider dashed />
      <Formik
        initialValues={{
          quoteId,
          prospect: currentProspect,
          brokerage: '',
          program: '',
          board: '',
          paymentMethod: [],
          coupon: '',
          send_email: false,
        }}
        enableReinitialize
        onSubmit={values => {
          console.log({ values })
          const data = {
            quote_name: values.quoteId,
            prospect_id: values.prospect,
            plan_id: values.program,
            user_id: getConfig().userId,
            //* optionals
            payment_method:
              values.paymentMethod.length === 0
                ? undefined
                : values.paymentMethod,
            coupon_id: values.coupon || undefined,
            send_email: values.send_email ? 1 : 0,
          }
          if (hasProspect) {
            createQuote(data)
              .then(({ data }) => {
                notification.success({
                  message: `Success`,
                  description: data[1],
                  placement: 'bottomRight',
                })
                navigate('/')
              })
              .catch(console.log)
          } else {
            delete data.prospect_id
            data.customer_id = customerId
            createQuote(data)
              .then(({ data }) => {
                notification.success({
                  message: `Success`,
                  description: data[1],
                  placement: 'bottomRight',
                })
                navigate('/')
              })
              .catch(console.log)
          }
        }}
        validationSchema={Yup.object({
          quoteId: Yup.string().required('This field is required.'),
          brokerage: Yup.string().required('This field is required.'),
          program: Yup.string().required('This field is required.'),
          board: Yup.string().when('program', (program, field) => {
            const hasIdx = programs.find(
              item => item.value === program,
            )?.has_idx
            setHasIdx(hasIdx)
            return hasIdx ? field.required('This field is required.') : field
          }),
        })}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <Fragment>
            <Form className={form} layout='vertical' autoComplete='off'>
              <Form.Item
                label='Quote ID'
                required
                validateStatus={errors.quoteId && touched.quoteId && 'error'}
                help={<ErrorMessage name='quoteId' />}
              >
                <Input name='quoteId' placeholder='Quote ID' disabled />
              </Form.Item>
              {customerId ? (
                <div>
                  <Typography style={{ paddingBottom: '8px' }}>
                    Customer
                  </Typography>
                  <Input
                    value={customer?.name + ' ' + customer?.last_name}
                    placeholder='Customer'
                    disabled
                  />
                </div>
              ) : (
                <Form.Item
                  label='Prospect'
                  required
                  validateStatus={
                    errors.prospect && touched.prospect && 'error'
                  }
                  help={<ErrorMessage name='prospect' />}
                >
                  <div
                    style={{
                      display: 'flex',
                      gap: 8,
                    }}
                  >
                    <Select
                      name='prospect'
                      options={prospects}
                      {...getSelectSearchProps()}
                    />
                    <Button onClick={handleAddProspect}>Add</Button>
                  </div>
                </Form.Item>
              )}
              {/* //? Brokerage filtra el Program */}
              <Form.Item
                label='Brokerage'
                required
                validateStatus={
                  errors.brokerage && touched.brokerage && 'error'
                }
                help={<ErrorMessage name='brokerage' />}
              >
                <Select
                  name='brokerage'
                  options={brokerages}
                  onChange={value => {
                    setCompany(value)
                    setFieldValue('program', '')
                    console.log('brokerage', value)
                  }}
                  {...getSelectSearchProps()}
                />
              </Form.Item>
              <Form.Item
                label='Program'
                required
                validateStatus={errors.program && touched.program && 'error'}
                help={<ErrorMessage name='program' />}
              >
                <Select
                  name='program'
                  options={programs}
                  {...getSelectSearchProps()}
                />
              </Form.Item>
              <Form.Item
                label='Board'
                required={hasIdx}
                validateStatus={errors.board && touched.board && 'error'}
                help={<ErrorMessage name='board' />}
              >
                <Select
                  name='board'
                  options={boards}
                  {...getSelectSearchProps()}
                />
              </Form.Item>
              <Form.Item
                label='Payment Method'
                required
                validateStatus={
                  errors.paymentMethod && touched.paymentMethod && 'error'
                }
                help={<ErrorMessage name='paymentMethod' />}
              >
                <Select
                  mode='multiple'
                  allowClear
                  name='paymentMethod'
                  options={paymentMethods}
                />
              </Form.Item>
              <Form.Item
                label='Coupon'
                required={false}
                validateStatus={errors.coupon && touched.coupon && 'error'}
                help={<ErrorMessage name='coupon' />}
              >
                <Select
                  name='coupon'
                  options={coupons}
                  {...getSelectSearchProps()}
                />
              </Form.Item>
            </Form>
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 8,
                paddingTop: 30,
              }}
            >
              <Checkbox
                onChange={e => setFieldValue('send_email', e.target.checked)}
                value={values.send_email}
                style={{
                  marginRight: 'auto',
                }}
              >
                Send quote
              </Checkbox>
              <Link to='/'>
                <Button>Cancel</Button>
              </Link>
              <Button
                type='primary'
                onClick={handleSubmit}
                loading={isLoadingQuote}
              >
                Save
              </Button>
            </div>
          </Fragment>
        )}
      </Formik>
    </div>
  )
}
