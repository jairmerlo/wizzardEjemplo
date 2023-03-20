import { Button, Divider, Form, Typography } from 'antd'
// import { useSelector } from 'react-redux'
import { Formik } from 'formik';
import { Input as FormikInput, Select, Checkbox } from 'formik-antd'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useCss } from 'react-use';
import { useGetCustomerQuery } from '../../../app/api/billing'
// import backoffice from '../../../app/api/backoffice'

export const CustomerEdit = () => {

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

    const navigate = useNavigate()
    const { customerId } = useParams()

    const { data = {}, isLoading } = useGetCustomerQuery(customerId)

    console.log({ data })
    //   const { data: { customerId } = {} } = useSelector(
    //     backoffice.endpoints.getMembership.select({
    //       registration_key: membershipRegKey,
    //     }),
    //   )

    return (
        <div
            style={{
                display: 'flex',
                height: '100vh',
                backgroundColor: '#f4f9fc',
                justifyContent: 'center'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    width: '900px',
                    // flexDirection: 'row',
                    // justifyContent: 'space-between',
                    // alignItems: 'center',
                    margin: '30px',
                    padding: '30px',
                    backgroundColor: '#fff',
                    boxShadow: '0 .25rem 1rem rgba(0,0,0,.1)'
                }}
            >
                <Formik
                    enableReinitialize
                >
                    {({ errors, touched, handleSubmit, setFieldValue, values }) => (
                        <>
                            <Form layout='vertical' autoComplete='off'>
                                <Typography.Title level={3}>
                                    Edit Customer
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
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company Template'>
                                        <FormikInput
                                            name='companyName'
                                            placeholder='Company Template'
                                            disabled
                                        />
                                    </Form.Item>
                                </div>
                                {/* <div style={{ flexGrow: 1 }} /> */}
                                {/* <Button size='small' danger onClick={() => navigate(-1)}>
                                    Back
                                </Button> */}

                            </Form>
                        </>
                    )}
                </Formik>

            </div>
        </div>
    )
}
