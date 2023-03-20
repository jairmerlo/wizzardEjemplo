import { Button, Card, Divider, Modal, Radio, Spin, Typography } from "antd"
import { useState } from "react";
import { useGetMembershipQuery } from "../../../app/api/backoffice"

export const SendMembership = ({
    registration_key,
    open,
    onClose = f => f
}) => {

    const { data = {}, isLoading } = useGetMembershipQuery(
        { registration_key },
        {
            skip: !open,
        },
    )

    const [value, setValue] = useState(0);

    const onChange = (e) => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    // console.log({ data })

    return (
        <>
            <Modal
                title={`Membership: ${data.membershipId}`}
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
                width={800}
                centered
                destroyOnClose
            >
                <Divider />
                <Typography.Title level={4}>
                    Programs
                </Typography.Title>

                {isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Spin tip='Loading' size='large' />
                    </div>
                ) : (
                    <>
                        <Radio.Group onChange={onChange} value={value}>
                            <Card title="Dominate Bundle">
                                <p >
                                    Dominate, a digital marketing program that goes beyond the traditional lead generation strategy. It’s a cross-platform strategy created not to only connect you with home buyers and sellers in your market, but to also elevate your brand and maximize its exposure using the most effective social media and Google network platforms.
                                </p>
                                <Divider />
                                <div
                                    style={{ justifyContent: "space-between", display: "flex" }}
                                >
                                    <Typography.Title
                                        level={5}
                                        strong
                                    >
                                        $2,499.97 /month
                                    </Typography.Title>
                                    <Typography>
                                        <Radio value={1}>Select Generate </Radio>
                                    </Typography>
                                </div>
                            </Card>
                            <Card title="Generate Marketing Service">
                                <p >
                                    Generate Marketing Service Description
                                </p>
                                <Divider />
                                <div
                                    style={{ justifyContent: "space-between", display: "flex" }}
                                >
                                    <Typography.Title
                                        level={5}
                                        strong
                                    >
                                        $400.00 /month
                                    </Typography.Title>
                                    <Typography>
                                        <Radio value={2}>Select Generate </Radio>
                                    </Typography>
                                </div>
                            </Card>
                        </Radio.Group>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-around",
                                width: "150px",
                                marginLeft: 'calc(100% - 150px)',
                            }}
                        >
                            <Button onClick={onClose}>Close</Button>
                            <Button onClick={onClose} type="primary">Save</Button>
                        </div>
                    </>
                )}


            </Modal>
        </>
    )
}
