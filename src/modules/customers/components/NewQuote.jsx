import {
  Button,
  Checkbox,
  Divider,
  Modal,
  notification,
  Typography,
} from 'antd'
import { ErrorMessage, Formik, useFormikContext } from 'formik'
import { Select, Input, Form } from 'formik-antd'
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useCss } from 'react-use'
import * as Yup from 'yup'
import {
  useCreateProspectMutation,
  useCreateQuoteMutation,
  useGetCustomerQuery,
  useGetCustomerV1Query,
  useGetNewQuotesOptionsQuery,
  useListMembershipTypeQuery,
  usePlansFilteredQuery,
} from '../../../app/api/billing'
import { ErrorHandler, Loader } from '../../../components'
import {
  capitalize,
  getConfig,
  getSelectSearchProps,
  toTitleCase,
} from '../../../helpers'
import { NewQuoteDescription } from '.'
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

  const item = useCss({
    padding: '7px 20px',
    fontSize: '14px',
    border: '1px solid #e4e4e4',
    borderRadius: '25px',
    minHeight: '50px'
  })

  const button = useCss({
    fontWeight: '600',
    padding: '12px 30px',
    marginLeft: '10px',
    // padding: '7px 20px',
    fontSize: '14px',
    border: '1px solid #e4e4e4',
    borderRadius: '25px',
    minHeight: '50px'
  })

  const form = useCss({
    display: 'grid',
    gridTemplateColumns: '49% 49%',
    columnGap: '16px',
    rowGap: '30px',
    '& > .ant-form-item': {
      margin: '0px',
    },
    '@media only screen and (max-width: 745px)': {
      gridTemplateColumns: '1fr',
    },
  })

  // const { values } = useFormikContext()
  // console.log({ values })

  const [hasIdx, setHasIdx] = useState()
  const [company, setCompany] = useState(0)
  const [category, setCategory] = useState(0)
  const [membership, setMembership] = useState(0)

  const { data: programs = [] } = usePlansFilteredQuery({
    company,
    bundle_type: category,
    membership_type: membership
  })

  // console.log({ programs })

  const { data: listMembership = [] } = useListMembershipTypeQuery({ bundle_type_id: category })

  const { data = {}, refetch } = useGetNewQuotesOptionsQuery({
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

  // console.log({ data })
  const {
    quoteId = '',
    prospects = [],
    brokerages = [],
    // programs = [],
    boards = [],
    paymentMethods = [],
    coupons = [],
    states = [],
    project_name = '',
    listBundle = [],
    // listMembership = [],
  } = data

  const {
    data: customer,
    isError: isErrorGetCustomer,
    isLoading: isLoadingGetCustomer,
  } = useGetCustomerV1Query(customerId, {
    skip: hasProspect,
  })
  // console.log({ customer })

  const fullName = `${customer?.name} ${customer?.last_name}`

  // console.log({
  //   programsHasIdx: programs.filter(item => item.has_idx === true),
  // })
  // console.log({ programs })
  const handleAddProspect = () => {
    setSearchParams({
      add: 'new-prospect',
    })
  }

  const handleCloseProspect = () => {
    setSearchParams({})
  }
  if (isLoadingGetCustomer) return <Loader />
  if (isErrorGetCustomer)
    return <ErrorHandler description='The customer does not exist.' />
  return (
    <div
      style={{
        display: 'flex',
        // height: '100vh',
        backgroundColor: '#f4f9fc',
        justifyContent: 'center'
        // maxWidth: '800px',
        // margin: 'auto'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '900px',
          // flexDirection: 'row',
          // justifyContent: 'space-between',
          // alignItems: 'center',
          margin: '30px',
          padding: '30px',
          backgroundColor: '#fff',
          boxShadow: '0 .25rem 1rem rgba(0,0,0,.1)',
          fontWeight: '600'
        }}
      >
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
                // console.log({ values })
                createProspect(values)
                  .then(({ data }) => {
                    if (data.status === 200) {
                      // console.log('refetch options')
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
        <Typography.Title level={4} style={{ fontWeight: 'bold' }}>New Quotes</Typography.Title>
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
            send_email: 0,
            show_cupon_wizard: 1,
            products: [],
            project_name,
            has_trial: 0,
            trial_length: '',
            bundle_type_id: '',
            membership_type_id: '',
            totalAmount: 0,
            totalSetup: 0
          }}
          enableReinitialize
          onSubmit={values => {
            let boardName = boards.filter(board => board.value === values.board)

            let products = (values.products.length === 0) ? [] : values.products?.map((product, index) => {
              return {
                ...product,
                currencies: product.currencies_format,
                item_sort: index,
              }
            })

            products.map(product => {
              if (product.currencies?.unit_amount !== 0) {
                values.totalSetup = values.totalSetup - product.currencies.setup_fee
              }
            })

            console.log({ values })

            const data = {
              project_name: values.project_name,
              // quote_name: values.quoteId,
              prospect_id: values.prospect,
              plan_id: values.program,
              user_id: getConfig().userId,
              //* optionals
              payment_method:
                values.paymentMethod.length === 0
                  ? undefined
                  : values.paymentMethod,
              coupon_id: values.coupon || 0,
              send_email: values.send_email,
              customer_id: customer.id,
              board_id: values.board,
              board_name: boardName[0].label,
              user_name: fullName,
              show_cupon_wizard: values.show_cupon_wizard,
              discount: 0,
              total_amount: values.totalAmount,
              total_setup: values.totalSetup,
              has_trial: values.has_trial,
              trial_length: values.trial_length,
              bundle_type_id: values.bundle_type_id,
              membership_type_id: values.membership_type_id,
              items: products
            }
            console.log({ data })
            if (hasProspect) {
              createQuote(data)
                .then(({ data }) => {
                  notification.success({
                    message: `Success`,
                    description: data[1],
                    placement: 'bottomRight',
                  })
                  navigate(-1)
                })
                .catch(console.log)
            } else {
              delete data.prospect_id
              // data.customer_id = customer.id
              createQuote(data)
                .then(({ data }) => {
                  notification.success({
                    message: `Success`,
                    description: data[1],
                    placement: 'bottomRight',
                  })
                  navigate(-1)
                })
                .catch(console.log)
            }
          }}
          validationSchema={Yup.object({
            // quoteId: Yup.string().required('This field is required.'),
            paymentMethod: Yup.array().min(1, 'This field is required.'),
            bundle_type_id: Yup.string().required('This field is required.'),
            membership_type_id: Yup.string().required('This field is required.'),
            // has_trial: Yup.boolean(),
            // trial_length: Yup
            //   .string()
            //   .when('has_trial', {
            //     is: true,
            //     then: Yup.string().required('This field is required.')
            //   })
            // ,
            // project_name: Yup.string().required('This field is required.'),
            brokerage: Yup.string().required('This field is required.'),
            program: Yup.string().required('This field is required.'),
            board: Yup.string().when('program', (program, field) => {
              const hasIdx = programs.find(
                item => item.value === program,
              )?.has_idx
              setHasIdx(hasIdx)
              return hasIdx ? field.required('This field is required.') : field
            }),
            products: Yup.array().of(
              Yup.object().shape({
                plan_id: Yup.string().required('This field is required.'),
                item_id: Yup.string().required('This field is required.'),
                currencies_format: Yup.object({
                  currency: Yup.string(),
                  setup_fee: Yup.number().required('This field is required.'),
                  unit_amount: Yup.number().required('This field is required.'),
                }),
                category: Yup.string(), //* id group
                product_category: Yup.string().required(
                  'This field is required.',
                ),
                item_sort: Yup.number(),
              }),
            ),
          })}
        >
          {({ handleSubmit, errors, touched, values, setFieldValue }) => (
            <Fragment>
              <Form className={form} layout='vertical' autoComplete='off'>
                <Form.Item
                  label='Project Name'
                  validateStatus={errors.project_name && touched.project_name && 'error'}
                  help={<ErrorMessage name='project_name' />}
                >
                  <Input name='project_name' className={item} />
                </Form.Item>
                {/* <Form.Item
                  label='Quote ID'
                  required
                  validateStatus={errors.quoteId && touched.quoteId && 'error'}
                  help={<ErrorMessage name='quoteId' />}
                >
                  <Input name='quoteId' placeholder='Quote ID' disabled className={item} />
                </Form.Item> */}
                {customerId ? (
                  <div>
                    <Typography style={{ paddingBottom: '8px' }}>
                      Customer
                    </Typography>
                    <Input
                      value={customer?.name + ' ' + customer?.last_name}
                      placeholder='Customer'
                      disabled
                      className={item}
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
                        className={item}
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
                    className={item}
                    name='brokerage'
                    options={brokerages}
                    bordered={false}
                    {...getSelectSearchProps()}
                    onChange={value => {
                      setCompany(value)
                      setFieldValue('program', '')
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Category Product Service'

                  required
                  validateStatus={errors.bundle_type_id && touched.bundle_type_id && 'error'}
                  help={<ErrorMessage name='bundle_type_id' />}
                >
                  <Select
                    className={item}
                    name='bundle_type_id'
                    options={listBundle}
                    {...getSelectSearchProps()}
                    bordered={false}
                    onChange={value => {
                      setCategory(value)
                      setFieldValue('program', '')
                      setFieldValue('membership_type_id', '')
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Membership Type'
                  required
                  validateStatus={errors.membership_type_id && touched.membership_type_id && 'error'}
                  help={<ErrorMessage name='membership_type_id' />}
                >
                  <Select
                    className={item}
                    name='membership_type_id'
                    options={listMembership}
                    {...getSelectSearchProps()}
                    bordered={false}
                    onChange={value => {
                      setMembership(value)
                      setFieldValue('program', '')
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Program'
                  required
                  validateStatus={errors.program && touched.program && 'error'}
                  help={<ErrorMessage name='program' />}
                >
                  <Select
                    bordered={false}
                    className={item}
                    name='program'
                    options={(values.brokerage && values.bundle_type_id && values.membership_type_id) ? programs : []}
                    {...getSelectSearchProps()}
                    onChange={() => {
                      setFieldValue('has_trial', 0)
                      setFieldValue('trial_length', '')
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Board'
                  required={hasIdx}
                  validateStatus={errors.board && touched.board && 'error'}
                  help={<ErrorMessage name='board' />}
                >
                  <Select
                    disabled={(programs?.find(({ value }) => value === values.program)?.has_idx ? false : true)}
                    bordered={false}
                    className={item}
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
                    bordered={false}
                    className={item}
                    mode='multiple'
                    allowClear
                    name='paymentMethod'
                    options={paymentMethods}
                    onChange={() => {
                      setFieldValue('has_trial', 0)
                      setFieldValue('trial_length', '')
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Coupon'
                  required={false}
                  validateStatus={errors.coupon && touched.coupon && 'error'}
                  help={<ErrorMessage name='coupon' />}
                >
                  <Select
                    bordered={false}
                    className={item}
                    name='coupon'
                    options={coupons}
                    {...getSelectSearchProps()}
                    onChange={() => {
                      setFieldValue('has_trial', 0)
                      setFieldValue('trial_length', '')
                    }}
                  />
                </Form.Item>

                {values.coupon && (
                  <Checkbox
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                    onChange={e =>
                      setFieldValue('show_cupon_wizard', e.target.checked ? 1 : 0)
                    }
                    checked={values.show_cupon_wizard}
                  >
                    Showing Applying Coupon
                  </Checkbox>
                )}
              </Form>
              <NewQuoteDescription programs={programs} />
              {/* {console.log({ values })} */}
              {/* <div
                style={{
                  display: (values.paymentMethod[0] === 'card' && values.paymentMethod[1] === undefined && values.coupon === '' && (programs?.find(({ value }) => value === values.program)?.trial_quote === "1")) ? 'block' : 'none'
                }}
              >
                <Typography.Title level={4} style={{ fontWeight: 'bold' }}>Recurly Information</Typography.Title>
                <Divider dashed />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                  }}
                >
                  <Checkbox
                    // style={{ marginTop: 'auto', marginBottom: 'auto' }}
                    onChange={e =>
                      setFieldValue('has_trial', e.target.checked ? 1 : 0)
                    }
                    checked={values.has_trial}
                  >
                    Has trial
                  </Checkbox>
                  <Form.Item
                    style={{
                      visibility: (values.has_trial === 1) ? 'visible' : 'hidden'
                    }}
                    label='Trial Length (Days)'
                    required
                    validateStatus={errors.trial_length && touched.trial_length && 'error'}
                    help={<ErrorMessage name='trial_length' />}
                  >
                    <Input name='trial_length' className={item} />
                  </Form.Item>
                </div>
              </div> */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 8,
                  paddingTop: 30,
                }}
              >
                <Checkbox
                  onChange={e => setFieldValue('send_email', e.target.checked ? 1 : 0)}
                  checked={values.send_email}
                  style={{
                    marginRight: 'auto',
                  }}
                >
                  Send quote
                </Checkbox>
                <Link to='/'>
                  <Button className={button}>Cancel</Button>
                </Link>
                <Button
                  type='primary'
                  onClick={handleSubmit}
                  loading={isLoadingQuote}
                  className={button}
                  style={{
                    backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)'
                  }}
                >
                  Save
                </Button>
              </div>
            </Fragment>
          )}
        </Formik>
      </div>
    </div>
  )
}
