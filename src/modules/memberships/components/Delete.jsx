import { Button, Modal } from "antd"

export const Delete = ({ registration_key, open, onClose }) => {
    return (
        <>
            <Modal
                title={`You sure want to delete this Membership`}
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
                <Button onClick={onClose}>ok</Button>
                <Button onClick={onClose}>Cancel</Button>
            </Modal>
        </>
    )
}
