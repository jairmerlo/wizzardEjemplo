import { Button, Divider, Form, Typography } from 'antd'
// import { useSelector } from 'react-redux'
import { Formik } from 'formik';
import { Input as FormikInput, Select, Checkbox } from 'formik-antd'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useCss } from 'react-use';
import { useGetCustomerQuery, useGetNewQuotesOptionsQuery, useGetStatesQuery } from '../../../app/api/billing'
import { useState } from 'react';
// import backoffice from '../../../app/api/backoffice'

export const CustomerEdit = () => {

    const form = useCss({
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '20px',
        rowGap: '20px',
        '& > .ant-form-item': {
            margin: '0px',
        },
        '@media only screen and (max-width: 745px)': {
            gridTemplateColumns: '1fr',
        },
    })
    const form2 = useCss({
        display: 'grid',
        margin: '20px 0',
        gridTemplateColumns: '1fr 1fr 1fr',
        columnGap: '20px',
        rowGap: '20px',
        '& > .ant-form-item': {
            margin: '0px',
        },
        '@media only screen and (max-width: 745px)': {
            gridTemplateColumns: '1fr',
        },
    })

    const item = useCss({
        padding: '7px 20px',
        fontSize: '14px',
        border: '1px solid #e4e4e4',
        borderRadius: '25px',
        minHeight: '50px'
    })

    const navigate = useNavigate()
    const { customerId } = useParams()

    const { data = {}, isLoading } = useGetCustomerQuery(customerId)

    const { data: states } = useGetStatesQuery()
    console.log({ states })
    const optionsStates = states.map(state => {
        return {
            value: state.name,
            label: state.name
        }
    })
    //   const { data: { customerId } = {} } = useSelector(
    //     backoffice.endpoints.getMembership.select({
    //       registration_key: membershipRegKey,
    //     }),
    //   )

    const {
        uuid = '',
        company_name = '',
        name = '',
        last_name = '',
        display_name_as = '',
        email_contact = '',
        phone = '',
        street1 = '',
        street2 = '',
        city = '',
        postal_code = '',
        state = '',
        profile_deployment = '',
        profile_marketing = '',
        profile_project_manager = '',
        principal_membership = '',

    } = data

    const optionsName = [
        {
            value: `${name} ${last_name}`,
            label: `${name} ${last_name}`
        },
        {
            value: `${last_name}, ${name}`,
            label: `${last_name}, ${name}`
        },
    ]

    return (
        <div
            style={{
                display: 'flex',
                // height: '100vh',
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
                    onSubmit={values => {
                        console.log({ values })
                    }}
                    initialValues={{
                        uuid,
                        company_name,
                        name,
                        last_name,
                        display_name_as,
                        email_contact,
                        phone,
                        street1,
                        street2,
                        city,
                        postal_code,
                        state,
                        profile_deployment,
                        profile_marketing,
                        profile_project_manager,
                        principal_membership,


                    }}
                >
                    {({ errors, touched, handleSubmit, setFieldValue, values }) => (
                        <>
                            <Form
                                layout='vertical'
                                autoComplete='off'
                                style={{
                                    width: '100%',
                                    fontWeight: '500'
                                }}
                            >
                                <Typography.Title level={4}>
                                    Edit Customer
                                </Typography.Title>
                                <Divider dashed />
                                <div
                                    className={form}
                                >
                                    <Form.Item label='Customer ID *'>
                                        <FormikInput
                                            name='uuid'
                                            disabled
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Company'>
                                        <FormikInput
                                            name='company_name'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Brokerage *'>
                                        <FormikInput
                                            name='companyName'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='First Name *'>
                                        <FormikInput
                                            name='name'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Last Name *'>
                                        <FormikInput
                                            name='last_name'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Display Name as *'>
                                        <Select
                                            name='display_name_as'
                                            options={optionsName}
                                            placeholder="--Select--"
                                            bordered={false}
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Email Username *'>
                                        <FormikInput
                                            name='email_contact'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Phone *'>
                                        <FormikInput
                                            name='phone'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Address'>
                                        <FormikInput
                                            name='street1'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Address 2'>
                                        <FormikInput
                                            name='street2'
                                            className={item}
                                        />
                                    </Form.Item>
                                </div>
                                <div className={form2} >
                                    <Form.Item label='City'>
                                        <FormikInput
                                            name='city'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Zip / Postal Code'>
                                        <FormikInput
                                            name='postal_code'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='State'>
                                        <Select
                                            name='state'
                                            placeholder="--Select--"
                                            bordered={false}
                                            className={item}
                                            options={optionsStates}
                                            showSearch
                                            filterOption={(input, option) =>
                                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                            }
                                        />
                                    </Form.Item>
                                </div>
                                <Typography.Title level={4}>
                                    Customer’s Team
                                </Typography.Title>
                                <Divider dashed />
                                <div className={form2} >
                                    <Form.Item label='Deployment Team'>
                                        <FormikInput
                                            name='profile_deployment                                            '
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Marketing Team'>
                                        <FormikInput
                                            name='profile_marketing'
                                            className={item}
                                        />
                                    </Form.Item>
                                    <Form.Item label='Project Manager Team'>
                                        <FormikInput
                                            name='profile_project_manager'
                                            className={item}
                                        />
                                    </Form.Item>
                                </div>
                                <Typography.Title level={4}>
                                    Associated Memberships
                                </Typography.Title>
                                <Divider dashed />
                                <Form.Item label='Master Membership *'>
                                    <FormikInput
                                        name='principal_membership'
                                        className={item}
                                    />
                                </Form.Item>

                                {/* <div style={{ flexGrow: 1 }} /> */}
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Button onClick={() => navigate(-1)} className={item} style={{ fontWeight: '600', padding: '12px 30px' }}>
                                        Back
                                    </Button>
                                    <Button onClick={() => navigate(-1)} className={item}
                                        style={{
                                            backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)',
                                            color: 'white',
                                            fontWeight: '600',
                                            padding: '12px 30px',
                                            marginLeft: '10px'
                                        }}
                                    >
                                        Save
                                    </Button>
                                </div>

                            </Form>
                        </>
                    )}
                </Formik>

            </div>
        </div>
    )
}
