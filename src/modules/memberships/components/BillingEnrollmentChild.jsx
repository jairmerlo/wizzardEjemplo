import { useBillingEnrollmentMutation, useGetNewQuotesOptionsQuery, useGetPlanBycompanyIdQuery } from "../../../app/api/billing"
import { ErrorMessage, Formik } from "formik"
import * as Yup from 'yup'
import { useCss, useSetState } from "react-use"
import { Input, Select } from "formik-antd"
import { getSelectSearchProps } from "../../../helpers"
import { Button, Divider, Form, Modal, Tooltip, Typography, notification } from "antd"
import { useState } from "react"
import moment from "moment"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"


export const BillingEnrollmentChild = ({ open = false, handleClose = f => f, registration_key = "" }) => {
    const navigate = useNavigate()
    const [setupfee, setSetupfee] = useState(0)
    const [monthly, setMonthly] = useState(0)
    const [billingEnrollment, { isLoading: isLoadingBilling }] = useBillingEnrollmentMutation()

    const [company, setCompany] = useState(0)

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

    const item = useCss({
        padding: '7px 20px',
        fontSize: '14px',
        border: '1px solid #e4e4e4',
        borderRadius: '25px',
        minHeight: '50px'
    })

    const item2 = useCss({
        padding: '7px 20px',
        fontSize: '14px',
        border: '3px solid #47aac5',
        borderRadius: '15px',
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

    const form2 = useCss({
        display: 'grid',
        margin: '20px 0',
        gridTemplateColumns: '1fr 1fr 1fr',
        columnGap: '150px',
        rowGap: '20px',
        '& > .ant-form-item': {
            margin: '0px',
        },
        '@media only screen and (max-width: 745px)': {
            gridTemplateColumns: '1fr',
        },
    })

    const { data = {}, refetch } = useGetNewQuotesOptionsQuery({
        has_trial: 0,
    })
    const {
        brokerages = [],
        // programs = []
    } = data

    const { data: programs = [] } = useGetPlanBycompanyIdQuery({
        company
    })

    const today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // console.log({ programs })

    return (
        <Modal
            // title={`Membership: ${membershipId}`}
            open={open}
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
            onCancel={handleClose}
            width={800}
            centered
            destroyOnClose
        >
            <Typography.Title level={4} style={{ fontWeight: 'bold' }}>Billing Enrollment</Typography.Title>
            <Divider dashed />
            <Formik
                onSubmit={values => {
                    console.log({ values })
                    billingEnrollment({
                        registration_key,
                        program_code: values.program_code,
                        periods_setupfee: values.periods_setupfee,
                        setupfee: values.programas.setupfee,
                        startdate_setupfee: values.startdate_setupfee,
                        periods_monthly: values.periods_monthly,
                        monthly: values.programas.monthly,
                        startdate_monthly: values.startdate_monthly
                    })
                        .then(({ data }) => {
                            notification.success({
                                message: `Success`,
                                description: data[1],
                                placement: 'bottomRight',
                            })
                            handleClose()
                            // navigate(-1)
                        })
                        .catch(console.log)
                }}
                enableReinitialize
                initialValues={{
                    brokerage: "",
                    programas: {},
                    program_code: "",
                    periods_setupfee: 1,
                    periods_monthly: 1,
                    startdate_setupfee: moment(new Date()).format('YYYY-MM-DD'),
                    startdate_monthly: moment(new Date()).format('YYYY-MM-DD'),
                }}
                validationSchema={Yup.object({
                    brokerage: Yup.string().required('This field is required.'),
                    program_code: Yup.string().required('This field is required.'),
                    startdate_setupfee: Yup.date()
                        .min(yesterday, "date must be greater than or equal to current date"),
                    startdate_monthly: Yup.date()
                        .min(Yup.ref('startdate_setupfee'), "date must be greater than or equal to setup fee date")
                })}
            >
                {({ handleSubmit, errors, touched, values, setFieldValue }) => (
                    <>
                        <Form layout='vertical' autoComplete='off'>
                            <div
                                className={form}
                            >
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
                                            setFieldValue('program_code', '')
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Program'
                                    required
                                    validateStatus={errors.program_code && touched.program_code && 'error'}
                                    help={<ErrorMessage name='program_code' />}
                                >
                                    <Select
                                        bordered={false}
                                        className={item}
                                        name='program_code'
                                        options={programs}
                                        {...getSelectSearchProps()}
                                        onChange={async (value) => {
                                            let programSelected = await programs.find((program) => program.value === value)

                                            setFieldValue('programas', programSelected
                                            )
                                        }}
                                    />
                                </Form.Item>

                            </div>
                            <div
                                className={form2}
                            >
                                <Form.Item
                                    label='Setup Fee'
                                    required
                                >
                                    <Input
                                        name={`programas.setupfee`}
                                        className={item2}
                                        type="number"
                                        min={0} />
                                </Form.Item>
                                <Form.Item
                                    label='Periods (Monthly)'
                                    required

                                >
                                    <Input
                                        name='periods_setupfee'
                                        className={item2}
                                        type="number"
                                        min={1}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Start Date'
                                    required
                                    validateStatus={errors.startdate_setupfee && touched.startdate_setupfee && 'error'}
                                    help={<ErrorMessage name='startdate_setupfee' />}
                                >
                                    <Input
                                        className={item2}
                                        name='startdate_setupfee'
                                        placeholder='Publication Date'
                                        type='date'
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Monthly'
                                    required
                                >
                                    <Input
                                        name={`programas.monthly`}
                                        className={item2}
                                        type="number"
                                        min={0}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Periods (Monthly)'
                                    required
                                >
                                    <Input
                                        name='periods_monthly'
                                        className={item2}
                                        type="number"
                                        min={1}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label='Start Data'
                                    required
                                    validateStatus={errors.startdate_monthly && touched.startdate_monthly && 'error'}
                                    help={<ErrorMessage name='startdate_monthly' />}
                                >
                                    <Input
                                        className={item2}
                                        name='startdate_monthly'
                                        placeholder='Publication Date'
                                        type='date'
                                    />
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
                                <Button className={button} onClick={handleClose}>Cancel</Button>
                                <Button
                                    type='primary'
                                    onClick={handleSubmit}
                                    loading={isLoadingBilling}
                                    className={button}
                                    style={{
                                        backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)'
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </Modal>
    )
}