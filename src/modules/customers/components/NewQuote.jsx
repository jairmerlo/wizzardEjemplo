import { Button, Divider, Typography } from 'antd'
import { ErrorMessage, Formik } from 'formik'
import { Select, Input, Form } from 'formik-antd'
import { Fragment } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useCss } from 'react-use'
import * as Yup from 'yup'

export const NewQuote = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const form = useCss({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '16px',
    rowGap: '30px',
    '& > .ant-form-item': {
      margin: '0px',
    },
  })
  return (
    <div style={{ maxWidth: '800px', margin: 'auto' }}>
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
              <Form.Item
                label='Prospect'
                required
                validateStatus={errors.prospect && touched.prospect && 'error'}
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
                  <Button>Add</Button>
                </div>
              </Form.Item>
              {/* //? Brokerage filtra el program */}
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
              <Button>Cancel</Button>
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
