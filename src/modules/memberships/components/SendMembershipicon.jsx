import { SendOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import { useState } from "react"
import { SendMembership } from "./SendMembership"

export const SendMembershipicon = ({ registration_key }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>
            <Tooltip title='Send' >
                <button className="buttonLink" onClick={handleOpen}>
                    <SendOutlined style={{ fontSize: '18px' }} />
                </button>
            </Tooltip>
            {open && (
                <SendMembership
                    registration_key={registration_key}
                    open={open}
                    onClose={handleClose}
                />
            )}
        </>
    )
}
