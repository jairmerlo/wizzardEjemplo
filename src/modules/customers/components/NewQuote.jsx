import { Button, Divider, Modal, Typography } from 'antd'
import { ErrorMessage, Formik } from 'formik'
import { Select, Input, Form } from 'formik-antd'
import { Fragment } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useCss } from 'react-use'
import * as Yup from 'yup'

export const NewQuote = () => {
  let [searchParams, setSearchParams] = useSearchParams()
  const customerId = searchParams.get('customerId')
  const hasProspect = !customerId
  const openModal = searchParams.get('add') === 'new-prospect' && hasProspect
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
  const handleAddProspect = () => {
    setSearchParams({
      add: 'new-prospect',
    })
  }

  const handleCloseProspect = () => {
    setSearchParams({})
  }

  const handleSaveProspect = () => {
    setSearchParams({})
  }
  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
      {openModal && (
        <Modal
          title='New Prospect'
          open={openModal}
          onOk={handleSaveProspect}
          onCancel={handleCloseProspect}
        >
          <Formik
            initialValues={{
              name: '',
              lastName: '',
              email: '',
              phone: '',
              address: '',
              address2: '',
              city: '',
              zipCode: '',
              state: '',
            }}
            enableReinitialize
            onSubmit={values => {
              console.log({ values })
            }}
            validationSchema={Yup.object({
              name: Yup.string().required('This field is required.'),
              lastName: Yup.string().required('This field is required.'),
              email: Yup.string()
                .email('Must be a valid email.')
                .required('This field is required.'),
              phone: Yup.number().required('This field is required.'),
              state: Yup.string(),
            })}
          >
            {({ handleSubmit, errors, touched }) => (
              <Fragment>
                <Form
                  className={form}
                  style={{ gap: '16px' }}
                  layout='vertical'
                  autoComplete='off'
                >
                  <Form.Item
                    label='Name'
                    required
                    validateStatus={errors.name && touched.name && 'error'}
                    help={<ErrorMessage name='name' />}
                  >
                    <Input name='name' placeholder='Name' />
                  </Form.Item>
                  <Form.Item
                    label='Last Name'
                    required
                    validateStatus={
                      errors.lastName && touched.lastName && 'error'
                    }
                    help={<ErrorMessage name='lastName' />}
                  >
                    <Input name='lastName' placeholder='Last Name' />
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
                    <Input name='phone' placeholder='Phone' />
                  </Form.Item>
                  <Form.Item
                    label='State'
                    validateStatus={errors.state && touched.state && 'error'}
                    help={<ErrorMessage name='state' />}
                  >
                    <Select
                      name='state'
                      options={[
                        {
                          value: 'jack',
                          label: 'Jack',
                        },
                        {
                          value: 'lucy',
                          label: 'Lucy',
                        },
                        {
                          value: 'disabled',
                          disabled: true,
                          label: 'Disabled',
                        },
                        {
                          value: 'Yiminghe',
                          label: 'yiminghe',
                        },
                      ]}
                    />
                  </Form.Item>
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
          quoteId: 'QTE0001',
          brokerage: '',
          program: 'jack',
          board: 'jack',
          coupon: 'jack',
          paymentMethod: [],
          prospect: 'jack',
        }}
        enableReinitialize
        onSubmit={values => {
          console.log({ values })
        }}
        validationSchema={Yup.object({
          quoteId: Yup.string().required('This field is required.'),
          brokerage: Yup.string().required('This field is required.'),
        })}
      >
        {({ handleSubmit, errors, touched }) => (
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
                  <Input value='Sofia Torres' placeholder='Customer' disabled />
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
                      options={[
                        {
                          value: 'jack',
                          label: 'Jack',
                        },
                        {
                          value: 'lucy',
                          label: 'Lucy',
                        },
                        {
                          value: 'disabled',
                          disabled: true,
                          label: 'Disabled',
                        },
                        {
                          value: 'Yiminghe',
                          label: 'yiminghe',
                        },
                      ]}
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
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'disabled',
                      disabled: true,
                      label: 'Disabled',
                    },
                    {
                      value: 'Yiminghe',
                      label: 'yiminghe',
                    },
                  ]}
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
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'disabled',
                      disabled: true,
                      label: 'Disabled',
                    },
                    {
                      value: 'Yiminghe',
                      label: 'yiminghe',
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label='Board'
                //? es requerido cuando posee IDX Program
                required={false}
                validateStatus={errors.board && touched.board && 'error'}
                help={<ErrorMessage name='board' />}
              >
                <Select
                  name='board'
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'disabled',
                      disabled: true,
                      label: 'Disabled',
                    },
                    {
                      value: 'Yiminghe',
                      label: 'yiminghe',
                    },
                  ]}
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
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'disabled',
                      disabled: true,
                      label: 'Disabled',
                    },
                    {
                      value: 'Yiminghe',
                      label: 'yiminghe',
                    },
                  ]}
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
                  options={[
                    {
                      value: 'jack',
                      label: 'Jack',
                    },
                    {
                      value: 'lucy',
                      label: 'Lucy',
                    },
                    {
                      value: 'disabled',
                      disabled: true,
                      label: 'Disabled',
                    },
                    {
                      value: 'Yiminghe',
                      label: 'yiminghe',
                    },
                  ]}
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
              <Link to='/'>
                <Button>Cancel</Button>
              </Link>
              <Button type='primary' onClick={handleSubmit}>
                Save
              </Button>
            </div>
          </Fragment>
        )}
      </Formik>
    </div>
  )
}
