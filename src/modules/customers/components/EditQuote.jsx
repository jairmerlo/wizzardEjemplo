import { useEffect, useState } from "react"
import { useGetNewQuotesOptionsQuery, useGetQuoteBynameQuery, useListMembershipTypeQuery, useModifyQuoteMutation, usePlansFilteredQuery } from "../../../app/api/billing"
import { Button, Divider, Form, Modal, Typography, notification } from "antd"
import { Formik, ErrorMessage } from "formik"
import { Input as FormikInput, Select, Checkbox, Input } from 'formik-antd'
import * as Yup from 'yup'
import { useCss } from "react-use"
import { getSelectSearchProps } from "../../../helpers"
import { NewQuoteDescription } from "./NewQuoteDescription"
import { Link } from "react-router-dom"


export const EditQuote = ({ quote_name = "", open = false, cancel = f => f }) => {

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

    const [modifyQuote, { isLoading: isLoadingQuote }] = useModifyQuoteMutation()



    const [hasIdx, setHasIdx] = useState(0)
    const [company, setCompany] = useState(0)
    const [category, setCategory] = useState(0)
    const [membership, setMembership] = useState(0)

    const { data: programs = [] } = usePlansFilteredQuery({
        company,
        bundle_type: category,
        membership_type: membership
    })
    const { data: listMembership = [] } = useListMembershipTypeQuery({ bundle_type_id: category })

    const { data: dataEdit = {} } = useGetQuoteBynameQuery({ quote_name })
    const { data = {}, refetch } = useGetNewQuotesOptionsQuery({
        has_trial: 0,
    })

    console.log({ data })
    console.log({ dataEdit })

    const {
        project_name = "",
        customer_name = "",
        customer_last_name = "",
        company_id = "",
        bundle_type_id = "",
        membership_type_id = "",
        plan_id = "",
        board_id = "",
        payment_method = [],
        coupon_id = "",
        show_cupon_wizard = 0,
        additional_items = [],


        id = "",
        prospect_id = "",
        customer_id = "",
        // plan_id = "",
        board_name = "",
        user_id = "",
        user_name = "",
        expiration_date = "",
        is_valid = "",
        status = "",
        has_trial = "0",
        trial_length = "0",
    } = dataEdit

    useEffect(() => {
        setCompany(company_id)
        setCategory(bundle_type_id)
        setMembership(membership_type_id)
    }, [dataEdit])


    const {
        prospects = [],
        brokerages = [],
        boards = [],
        paymentMethods = [],
        coupons = [],
        states = [],
        listBundle = [],
    } = data

    return (
        <Modal
            title="Edit quote"
            open={open}
            onOk={cancel}
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
            onCancel={cancel}
            width={800}
            centered
            destroyOnClose
        >
            <Typography.Title level={4} style={{ fontWeight: 'bold' }}>Edit Quotes</Typography.Title>
            <Divider />
            <Formik
                enableReinitialize
                onSubmit={values => {
                    console.log({ values }, "valores a enviar")

                    const data = {
                        id,
                        project_name: values.project_name,
                        prospect_id,
                        customer_id,
                        coupon_id: values.coupon,
                        plan_id: values.program,
                        board_id: values.board,
                        board_name,
                        user_id,
                        user_name,
                        expiration_date,
                        is_valid,
                        status,
                        send_email: values.send_email,
                        bundle_type_id: values.bundle_type_id,
                        payment_method: values.payment_method,
                        total_amount: values.totalAmount,
                        total_setup: values.totalSetup,
                        membership_type_id: values.membership_type_id,
                        items: values.products,
                        show_cupon_wizard: values.show_cupon_wizard,
                        has_trial,
                        trial_length,
                    }

                    modifyQuote(data)
                        .then(({ data }) => {
                            notification.success({
                                message: `Success`,
                                // description: data[1],
                                placement: 'bottomRight',
                            })
                            cancel()
                        })
                        .catch(console.log)


                }}
                initialValues={{

                    project_name,
                    customer_name,
                    customer_last_name,
                    brokerage: company_id,
                    bundle_type_id,
                    membership_type_id,
                    program: plan_id,
                    board: board_id,
                    payment_method,
                    coupon: coupon_id,
                    show_cupon_wizard,
                    products: additional_items,
                    send_email: 0,

                    // quoteId,
                    // program: '',
                    // board: '',
                    // paymentMethod: [],
                    // coupon: '',
                    // products: [],
                    totalAmount: 0,
                    totalSetup: 0
                }}
                validationSchema={Yup.object({
                    // quoteId: Yup.string().required('This field is required.'),
                    payment_method: Yup.array().min(1, 'This field is required.'),
                    bundle_type_id: Yup.string().required('This field is required.'),
                    membership_type_id: Yup.string().required('This field is required.'),
                    // has_trial: Yup.boolean(),
                    // trial_length: Yup
                    //     .string()
                    //     .when('has_trial', {
                    //         is: true,
                    //         then: Yup.string().required('This field is required.')
                    //     })
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
                            // plan_id: Yup.string().required('This field is required.'),
                            item_id: Yup.string().required('This field is required.'),
                            currencies: Yup.object({
                                currency: Yup.string(),
                                setup_fee: Yup.number().required('This field is required.'),
                                unit_amount: Yup.number().required('This field is required.'),
                            }),
                            // category: Yup.string(), //* id group
                            product_category: Yup.string().required(
                                'This field is required.',
                            ),
                            item_sort: Yup.number(),
                        }),
                    ),
                })}
            >
                {({ errors, touched, handleSubmit, setFieldValue, values }) => (
                    <>
                        <Form className={form} layout='vertical' autoComplete='off'>
                            <Form.Item
                                label='Project Name'
                                validateStatus={errors.project_name && touched.project_name && 'error'}
                                help={<ErrorMessage name='project_name' />}
                            >
                                <Input name='project_name' className={item} />
                            </Form.Item>
                            <Form.Item
                                label='Customer'
                            >
                                <Input
                                    value={customer_name + ' ' + customer_last_name}
                                    placeholder='Customer'
                                    disabled
                                    className={item}
                                />
                            </Form.Item>
                            <Form.Item
                                label='Brokerage'
                                required
                                validateStatus={
                                    errors.brokerage && touched.brokerage && 'error'
                                }
                                help={<ErrorMessage name='company_id' />}
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
                                    errors.payment_method && touched.payment_method && 'error'
                                }
                                help={<ErrorMessage name='payment_method' />}
                            >
                                <Select
                                    bordered={false}
                                    className={item}
                                    mode='multiple'
                                    allowClear
                                    name='payment_method'
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
                            <Button onClick={cancel} className={button}>Cancel</Button>
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
                    </>
                )
                }
            </Formik>
        </Modal>
    )
}
