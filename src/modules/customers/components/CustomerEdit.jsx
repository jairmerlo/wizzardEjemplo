import { Button, Divider, Form, Typography } from 'antd'
// import { useSelector } from 'react-redux'
import { ErrorMessage, Formik } from 'formik';
import { Input as FormikInput, Select, Checkbox } from 'formik-antd'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useCss } from 'react-use';
import { useEditCustomerMutation, useGetCustomerQuery, useGetNewQuotesOptionsQuery, useGetStatesQuery } from '../../../app/api/billing'
import { useState } from 'react';
import * as Yup from 'yup'
import { useGetProfilesToCustomersQuery } from '../../../app/api/backoffice';
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
    const [editCustomer] = useEditCustomerMutation()

    const { data: profiles = {} } = useGetProfilesToCustomersQuery()

    const { data: states } = useGetStatesQuery()
    const optionsStates = states?.map(state => {
        return {
            value: state.name,
            label: state.name
        }
    })

    let {
        // company_id = '',
        id = '',
        uuid = '',
        company_name = '',
        brokerage_name = '',
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
        profile_deployment_v2 = [],
        profile_marketing_v2 = [],
        profile_project_manager_v2 = [],
        principal_membership = '',
        memberships = []
    } = data

    profile_deployment_v2 = profile_deployment_v2.map(profile => {
        return {
            value: profile.id,
            label: profile.username
        }
    })

    profile_marketing_v2 = profile_marketing_v2.map(profile => {
        return {
            value: profile.id,
            label: profile.username
        }
    })

    profile_project_manager_v2 = profile_project_manager_v2.map(profile => {
        return {
            value: profile.id,
            label: profile.username
        }
    })

    let optDeployment = []
    let optMarketing = []
    let optManager = []
    if (profiles.profiles_depayment !== undefined) {
        optDeployment = [...profiles.profiles_depayment]
    }
    if (profiles.profiles_marketing !== undefined) {
        optMarketing = [...profiles.profiles_marketing]
    }
    if (profiles.profiles_project_manager !== undefined) {
        optManager = [...profiles.profiles_project_manager]
    }

    const optionsMasterMembership = memberships.map(membership => {
        return {
            value: membership.membership_id,
            label: membership.membership_id
        }
    })

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
                    onSubmit={async values => {
                        let profileDeployment = values.profile_deployment_v2.map(profile => {
                            if (isNaN(profile)) {
                                return profile.value
                            } return profile
                        })

                        let profileMarketin = values.profile_marketing_v2.map(profile => {
                            if (isNaN(profile)) {
                                return profile.value
                            } return profile
                        })

                        let profileProject = values.profile_project_manager_v2.map(profile => {
                            if (isNaN(profile)) {
                                return profile.value
                            } return profile
                        })

                        // navigate(-1)
                        const res = editCustomer({
                            city: values.city,
                            company: values.company_name,
                            company_id: "2",
                            display_name_as: values.display_name_as,
                            email_contact: values.email_contact,
                            id,
                            last_name: values.last_name,
                            name: values.name,
                            phone: values.phone,
                            postal_code: values.postal_code.toString(),
                            principal_membership: values.principal_membership,
                            profile_deployment: profileDeployment,
                            profile_marketing: profileMarketin,
                            profile_project_manager: profileProject,
                            state: values.state,
                            street1: values.street1,
                            street2: values.street2,
                            uuid: values.uuid,
                        })

                        // {
                        //     "uuid":"IDX001510",
                        //     "company":"Idxboost",
                        //     "display_name_as":"Test Stripe Test",
                        //     "id":"1510",
                        //     "name":"Test Stripe",
                        //     "city":"Address 2",
                        //     "state":"AS",
                        //     "postal_code":"44444",
                        //     "last_name":"Test",
                        //     "email_contact":"7709678678@gmail.com",
                        //     "phone":"(112) 312-3123",
                        //     "street1":"Address",
                        //     "street2":"Address 2",
                        //     "company_id":"2",
                        //     "profile_deployment":"[\"30\"]",
                        //     "profile_marketing":"[\"14\"]",
                        //     "profile_project_manager":"[\"28\"]",
                        //     "principal_membership":"Boost02342",
                        //     "system":"Backoffice"
                        // }

                    }}
                    initialValues={{
                        uuid,
                        company_name,
                        brokerage_name,
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
                        profile_deployment_v2,
                        profile_marketing_v2,
                        profile_project_manager_v2,
                        principal_membership,
                    }}
                    validationSchema={Yup.object({
                        email_contact: Yup.string()
                            .email('The email does not have a valid format')
                            .required('Requerido'),
                        postal_code: Yup.string()
                            .max(5, 'Maximum length 5')
                            .required('Requerido'),
                    })}
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
                                        <Select
                                            name='brokerage_name'
                                            placeholder="--Select--"
                                            options={[
                                                { value: 'Stanrdar', label: 'Stanrdar' },
                                                { value: 'Resf', label: 'Resf' },
                                                { value: 'Compass', label: 'Compass' },
                                            ]}
                                            bordered={false}
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
                                    <Form.Item
                                        label='Email Username *'
                                        validateStatus={errors.email_contact}
                                        help={<ErrorMessage name='email_contact' />}
                                    >
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
                                    <Form.Item
                                        label='Zip / Postal Code'
                                        validateStatus={errors.postal_code}
                                        help={<ErrorMessage name='postal_code' />}
                                    >
                                        <FormikInput
                                            name='postal_code'
                                            className={item}
                                            type='number'
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
                                        <Select
                                            name='profile_deployment_v2'
                                            options={optDeployment}
                                            className={item}
                                            placeholder="--Select--"
                                            bordered={false}
                                            mode='multiple'
                                        />
                                    </Form.Item>
                                    <Form.Item label='Marketing Team'>
                                        <Select
                                            name='profile_marketing_v2'
                                            options={optMarketing}
                                            className={item}
                                            placeholder="--Select--"
                                            bordered={false}
                                            mode='multiple'
                                        />
                                    </Form.Item>
                                    <Form.Item label='Project Manager Team'>
                                        <Select
                                            name='profile_project_manager_v2'
                                            options={optManager}
                                            className={item}
                                            placeholder="--Select--"
                                            bordered={false}
                                            mode='multiple'
                                        />
                                    </Form.Item>
                                </div>
                                <Typography.Title level={4}>
                                    Associated Memberships
                                </Typography.Title>
                                <Divider dashed />
                                <Form.Item label='Master Membership *'>
                                    <Select
                                        name='principal_membership'
                                        placeholder="--Select--"
                                        options={optionsMasterMembership}
                                        className={item}
                                        bordered={false}
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
                                    <Button onClick={handleSubmit} className={item}
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




