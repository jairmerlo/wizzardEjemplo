import { Button, Modal } from "antd"

export const Request = ({ registration_key, open, onClose }) => {
    return (
        <>
            <Modal
                title={`Membership`}
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
                <Button onClick={onClose}>Cancel</Button>
            </Modal>
        </>
    )
}
