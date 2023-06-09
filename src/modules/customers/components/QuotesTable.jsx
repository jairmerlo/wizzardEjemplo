import { EyeTwoTone, EditTwoTone, DeleteTwoTone, SendOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Modal, Space, Table, Tag, Tooltip, Typography, notification } from 'antd'
import currency from 'currency.js'
import {
  getColumnProps,
  getColumnSearchProps,
  getColumnSortProps,
  getDateColumnSearchProps,
  getSelectSearchProps,
  showTotal,
  USD,
} from '../../../helpers'
import { getColumnFilterProps } from '../../../helpers/getColumnFilterProps'
import { useColumnSearch } from '../../../hooks'
import { getStatusColor } from '../helpers'
import { useState } from 'react'
import { useDeleteQuoteMutation, useModifyQuoteMutation, useSendQuoteMutation } from '../../../app/api/billing'
import { ErrorMessage, Formik } from 'formik'
import { Input as FormikInput, Select, Checkbox, Input } from 'formik-antd'
import { useCss } from 'react-use'
import * as Yup from 'yup'

export const QuotesTable = ({ dataSource, refetch = f => f }) => {
  const { handleReset, handleSearch, searchInput, searchedColumn, searchText } =
    useColumnSearch({
      quote_name: null,
      name: null,
      accounting_class_name: null,
      created_on: null,
      total_amount: null,
    })

  console.log({ dataSource })

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

  const [modifyQuote] = useModifyQuoteMutation()
  const [sendQuote] = useSendQuoteMutation()
  const [deleteQuote] = useDeleteQuoteMutation()

  const [openSend, setOpenSend] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState({})

  const columns = [
    {
      ...getColumnProps({
        title: 'Quote ID',
        dataIndex: 'quote_name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'quote_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'quote_name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Program',
        dataIndex: 'name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Product/Service',
        dataIndex: 'accounting_class_name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'accounting_class_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'accounting_class_name',
      }),
    },
    {
      ...getColumnProps({ title: 'Created Date', dataIndex: 'created_on' }),
      ...getDateColumnSearchProps({
        dataIndex: 'created_on',
        initialFormat: 'MM-DD-YYYY',
        finalFormat: 'll',
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'created_on',
        type: 'date',
        format: 'MM-DD-YYYY',
      }),
    },
    {
      ...getColumnProps({ title: '$ Setup Fee', dataIndex: 'total_setup' }),
      ...getColumnSearchProps({
        dataIndex: 'total_setup',
        searchInput,
        searchedColumn,
        searchText,
        normalizeText: USD,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'total_setup',
        sorter: (a, b) => {
          return currency(a.total_setup).value - currency(b.total_setup).value
        },
      }),
    },
    {
      ...getColumnProps({ title: '$ Price', dataIndex: 'total_amount' }),
      ...getColumnSearchProps({
        dataIndex: 'total_amount',
        searchInput,
        searchedColumn,
        searchText,
        normalizeText: USD,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'total_amount',
        sorter: (a, b) => {
          return currency(a.total_amount).value - currency(b.total_amount).value
        },
      }),
    },
    {
      ...getColumnProps({
        title: 'Expired Date',
        dataIndex: 'expiration_date',
      }),
      ...getDateColumnSearchProps({
        dataIndex: 'expiration_date',
        initialFormat: 'MM-DD-YYYY',
        finalFormat: 'll',
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'expiration_date',
        type: 'date',
        format: 'MM-DD-YYYY',
      }),
    },
    {
      ...getColumnProps({
        title: 'Status',
        dataIndex: 'status',
      }),
      ...getColumnFilterProps({
        dataIndex: 'status',
        filters: [{ text: 'Completed', value: 'Completed' }],
      }),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      ...getColumnProps({ title: 'Sales Agent', dataIndex: 'user_name' }),
      ...getColumnSearchProps({
        dataIndex: 'user_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'user_name',
      }),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <>
          {
            (record?.status === 'Waiting for Client' || record?.status === 'Pending to Send') && (
              <Space size='middle'>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <EyeTwoTone style={{ fontSize: '18px' }} />
                  </a>
                </Tooltip>
                <Tooltip title='Edit' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <EditTwoTone
                      style={{ fontSize: '18px' }}
                      onClick={() => {
                        setCurrentUser(record)
                        setOpen(true)
                      }}
                    />
                  </a>
                </Tooltip>
                <Tooltip title='Send' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <SendOutlined style={{ fontSize: '18px' }} onClick={() => {
                      setCurrentUser(record)
                      setOpenSend(true)
                    }
                    } />
                  </a>
                </Tooltip>
                <Tooltip title='Delete' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <DeleteTwoTone style={{ fontSize: '18px' }} onClick={() => {
                      setCurrentUser(record)
                      setOpenDelete(true)

                    }} />
                  </a>
                </Tooltip>
                {/* eslint-enable jsx-a11y/anchor-is-valid */}
              </Space>
            )
          }
          {
            (record?.status === 'Completed') && (
              <Space size='middle'>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <EyeTwoTone style={{ fontSize: '18px' }} />
                  </a>
                </Tooltip>
                {/* eslint-enable jsx-a11y/anchor-is-valid */}
              </Space>
            )
          }
        </>
      ),
    },
  ]

  const {
    id = "",
    project_name = "",
    prospect_id = "",
    customer_id = "",
    coupon_id = "",
    plan_id = "",
    board_id = "",
    board_name = "",
    user_id = "",
    user_name = "",
    expiration_date = "",
    is_valid = "",
    status = "",
    send_email = "",
    bundle_type_id = "",
    payment_method = "",
    total_amount = "",
    total_setup = "",
    membership_type_id = "",
    items = "",
    show_cupon_wizard = "",
    has_trial = "",
    trial_length = "",
    last_name = "",
    prospect_name = ""
  } = currentUser

  // console.log({ currentUser })

  return (
    <>
      <Table
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={dataSource?.map(item => ({
          ...item,
          price: parseFloat(item.total_amount) + parseFloat(item.total_setup),
        }))}
        bordered
        pagination={{
          showTotal,
        }}
      />
      <Modal
        // title="Edit quote"
        open={open}
        onOk={() => setOpen(false)}
        // okButtonProps={{
        //   style: {
        //     display: 'none',
        //   },
        // }}
        // cancelButtonProps={{
        //   style: {
        //     display: 'none',
        //   },
        // }}
        onCancel={() => setOpen(false)}
        width={800}
        centered
        destroyOnClose
      >
        <Typography.Title level={4} style={{ fontWeight: 'bold' }}>Edit Quotes</Typography.Title>
        <Divider />
        <Formik
          enableReinitialize
          onSubmit={values => {
            console.log({ values })
          }}
          initialValues={{
            id,
            project_name,
            prospect_id,
            customer_id,
            coupon_id,
            plan_id,
            board_id,
            board_name,
            user_id,
            user_name,
            expiration_date,
            is_valid,
            status,
            send_email,
            bundle_type_id,
            payment_method,
            total_amount,
            total_setup,
            membership_type_id,
            items,
            show_cupon_wizard,
            has_trial,
            trial_length,
            last_name,
            prospect_name,
          }}
          validationSchema={Yup.object({
            // quoteId: Yup.string().required('This field is required.'),
            paymentMethod: Yup.array().min(1, 'This field is required.'),
            bundle_type_id: Yup.string().required('This field is required.'),
            membership_type_id: Yup.string().required('This field is required.'),
            has_trial: Yup.boolean(),
            trial_length: Yup
              .string()
              .when('has_trial', {
                is: true,
                then: Yup.string().required('This field is required.')
              })
            ,
            // project_name: Yup.string().required('This field is required.'),
            brokerage: Yup.string().required('This field is required.'),
            program: Yup.string().required('This field is required.'),
            // board: Yup.string().when('program', (program, field) => {
            //   const hasIdx = programs.find(
            //     item => item.value === program,
            //   )?.has_idx
            //   setHasIdx(hasIdx)
            //   return hasIdx ? field.required('This field is required.') : field
            // }),
            products: Yup.array().of(
              Yup.object().shape({
                plan_id: Yup.string().required('This field is required.'),
                item_id: Yup.string().required('This field is required.'),
                currencies: Yup.object({
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
          {({ errors, touched, handleSubmit, setFieldValue, values }) => (
            <>
              <Form className={form} layout='vertical' autoComplete='off'>
                <Form.Item
                  label='Project Name'
                // validateStatus={errors.project_name && touched.project_name && 'error'}
                // help={<ErrorMessage name='project_name' />}
                >
                  <Input name='project_name' className={item} />
                </Form.Item>
                <Form.Item
                  label='Customer'
                >
                  <Input
                    value={prospect_name + ' ' + last_name}
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
                  help={<ErrorMessage name='brokerage' />}
                >
                  <Select
                    className={item}
                    name='brokerage'
                    // options={brokerages}
                    bordered={false}
                    {...getSelectSearchProps()}
                  // onChange={value => {
                  //   setCompany(value)
                  //   setFieldValue('program', '')
                  // }}
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
                    // options={listBundle}
                    {...getSelectSearchProps()}
                    bordered={false}
                  // onChange={value => {
                  //   setCategory(value)
                  //   setFieldValue('program', '')
                  //   setFieldValue('membership_type_id', '')
                  // }}
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
                    // options={listMembership}
                    {...getSelectSearchProps()}
                    bordered={false}
                    onChange={value => {
                      // setMembership(value)
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
                    // options={(values.brokerage && values.bundle_type_id && values.membership_type_id) ? programs : []}
                    {...getSelectSearchProps()}
                    onChange={() => {
                      setFieldValue('has_trial', 0)
                      setFieldValue('trial_length', '')
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label='Board'
                  // required={hasIdx}
                  validateStatus={errors.board && touched.board && 'error'}
                  help={<ErrorMessage name='board' />}
                >
                  <Select
                    // disabled={(programs?.find(({ value }) => value === values.program)?.has_idx ? false : true)}
                    bordered={false}
                    className={item}
                    name='board'
                    // options={boards}
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
                    // options={paymentMethods}
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
                    // options={coupons}
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
            </>
          )
          }
        </Formik>
      </Modal>
      <Modal
        open={openSend}
        onOk={() => setOpenSend(false)}
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
        onCancel={() => setOpenSend(false)}
        width={600}
        centered
        destroyOnClose
      >
        <Typography.Title level={4} style={{ fontWeight: 'bold' }}>You sure want to send the quote?</Typography.Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            paddingTop: 30,
          }}
        >
          <Button
            className={button}
            onClick={() => setOpenSend(false)}
          >
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={() => {
              setOpenSend(false)
              sendQuote({ quote_id: currentUser.quote_id, user_id: currentUser.user_id, user_name: currentUser.user_name })
              notification.success({
                message: `Success`,
                placement: 'bottomRight',
                description: 'The quote has been send successfully. ',
              })
              refetch()
            }}
            className={button}
            style={{
              backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)'
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
      <Modal
        open={openDelete}
        onOk={() => setOpenDelete(false)}
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
        onCancel={() => setOpenDelete(false)}
        width={600}
        centered
        destroyOnClose
      >
        <Typography.Title level={4} style={{ fontWeight: 'bold' }}>You sure want to delete the quote?</Typography.Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            paddingTop: 30,
          }}
        >
          <Button
            className={button}
            onClick={() => {
              setOpenDelete(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={() => {
              setOpenDelete(false)
              deleteQuote({ quoteId: currentUser.quote_id })
              notification.success({
                message: `Success`,
                placement: 'bottomRight',
                description: 'The quote has been deleted successfully.',
              })
              setTimeout(() => {
                refetch()
              }, 1000);
            }}
            className={button}
            style={{
              backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)'
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </>
  )
}
