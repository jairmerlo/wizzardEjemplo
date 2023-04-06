import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Typography } from 'antd'
import { Input as FormikInput } from 'formik-antd'
import { Formik } from 'formik';
import { useSendAuthorizationFormMutation } from '../../../app/api/billing';

export const FormAuth = ({ authorization_form_type, registration_key, user_id, open, onClose, onSuccess }) => {
    const [sendAuthorizationForm] = useSendAuthorizationFormMutation()
    return (
        <Modal
            title={`${authorization_form_type} Authorization Form`}
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
            onCancel={onClose}
            destroyOnClose
            width={500}
            centered
        >
            <p style={{
                paddingRight: '30px'
            }}>
                Please provide a list of all the items along with their corresponding prices that are intended to be used on this authorization form.
            </p>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    fontSize: '17px',
                    fontWeight: 'bold'
                }}
            >
                <p> Item Name</p>
                <p>Item Price</p>
            </div>
            <Formik
                enableReinitialize
                onSubmit={async (values) => {
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

                    const res = await sendAuthorizationForm({
                        authorization_form_type,
                        registration_key,
                        user_id,
                        labels_prices: data
                    }).unwrap()
                    onSuccess()
                }}
                initialValues={{
                    label0: null,
                    label1: null,
                    label2: null,
                    label3: null,
                    label4: null,
                    label5: null,
                    label6: null,
                    label7: null,
                    value0: null,
                    value1: null,
                    value2: null,
                    value3: null,
                    value4: null,
                    value5: null,
                    value6: null,
                    value7: null,
                }}
            >
                {({ errors, touched, handleSubmit, values }) => (
                    <Form
                        name="dynamic_form_nest_item"
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
                                <FormikInput name='label0' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value0' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label1' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value1' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label2' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value2' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label3' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value3' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label4' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value4' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label5' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value5' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label6' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value6' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='label7' />
                            </Form.Item>
                            <Form.Item>
                                <FormikInput name='value7' />
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
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        handleSubmit()
                                        onClose()
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}
