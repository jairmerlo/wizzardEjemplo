import { PullRequestOutlined } from "@ant-design/icons"
import { Tooltip } from "antd"
import { useState } from "react"
import { Request } from "./Request"

export const Requesticon = ({ registration_key }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>
            <Tooltip title='Request'>
                <a onClick={handleOpen}>
                    <PullRequestOutlined style={{ fontSize: '18px' }} />
                </a>
            </Tooltip>
            {open && (
                <Request
                    registration_key={registration_key}
                    open={open}
                    onClose={handleClose}
                />
            )}
        </>
    )
}
