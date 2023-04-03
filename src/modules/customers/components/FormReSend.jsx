import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space } from 'antd'
import { Field, Formik } from 'formik';
import { Input as FormikInput } from 'formik-antd'
import { useGetAuthorizationFormsQuery, useResendAuthorizationFormMutation } from '../../../app/api/billing';


export const FormReSend = ({ authorization_form_type, registration_key, user_id, open, onClose, onSuccess }) => {

    const [resendAuthorizationForm] = useResendAuthorizationFormMutation()

    const { data = [] } = useGetAuthorizationFormsQuery({
        registration_key,
        authorization_form_type,
        order: 'id desc',
    },
    )

    const {
        label0 = '', value0 = '',
    } = data[0].labels_prices[0]
    const {
        label1 = '', value1 = '',
    } = data[0].labels_prices[1]
    const {
        label2 = '', value2 = '',
    } = data[0].labels_prices[2]
    const {
        label3 = '', value3 = '',
    } = data[0].labels_prices[3]
    const {
        label4 = '', value4 = '',
    } = data[0].labels_prices[4]
    const {
        label5 = '', value5 = '',
    } = data[0].labels_prices[5]
    const {
        label6 = '', value6 = '',
    } = data[0].labels_prices[6]
    const {
        label7 = '', value7 = '',
    } = data[0].labels_prices[7]


    return (
        <Modal
            title={`Are you sure you want to send the ${authorization_form_type}?`}
            open={open}
            //   onOk={handleOk}
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
            onCancel={onClose}
            destroyOnClose
            width={500}
            centered
        >
            <Formik
                enableReinitialize
                onSubmit={async (values) => {
                    console.log({ values })
                    let data = [
                        { label0: values.label0, value0: values.value0 },
                        { label1: values.label1, value1: values.value1 },
                        { label2: values.label2, value2: values.value2 },
                        { label3: values.label3, value3: values.value3 },
                        { label4: values.label4, value4: values.value4 },
                        { label5: values.label5, value5: values.value5 },
                        { label6: values.label6, value6: values.value6 },
                        { label7: values.label7, value7: values.value7 },
                    ]

                    const res = await resendAuthorizationForm({
                        authorization_form_type,
                        registration_key,
                        user_id,
                        labels_prices: data
                    }).unwrap()
                    onSuccess()
                }}
                initialValues={{
                    label0, value0,
                    label1, value1,
                    label2, value2,
                    label3, value3,
                    label4, value4,
                    label5, value5,
                    label6, value6,
                    label7, value7,
                }}
            >
                {({ errors, touched, handleSubmit, setFieldValue, values }) => (
                    <Form
                        style={{
                            maxWidth: 600,
                        }}
                        autoComplete="off"
                    >
                        <Space
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                columnGap: '16px',
                            }}
                        >
                            <Form.Item>
                                <FormikInput name='label0' values={values.label0} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value0' values={values.value0} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label1' values={values.label1} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value1' values={values.value1} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label2' values={values.label2} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value2' values={values.value2} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label3' values={values.label3} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value3' values={values.value3} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label4' values={values.label4} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value4' values={values.value4} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label5' values={values.label5} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value5' values={values.value5} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label6' values={values.label6} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value6' values={values.value6} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label7' values={values.label7} />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value7' values={values.value7} />
                            </Form.Item>
                        </Space>
                        <Form.Item>
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}
                            >
                                <Button onClick={onClose} style={{ marginRight: '10px' }}>
                                    Cancel
                                </Button>
                                <Button type="primary" onClick={handleSubmit}>
                                    Ok
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}