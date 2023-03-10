import { DeleteTwoTone } from "@ant-design/icons"
import { Tooltip } from "antd"
import { useState } from "react"
import { Delete } from "./Delete"

export const Deleteicon = ({ registration_key }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    return (
        <>
            <Tooltip title='Delete'>
                <a onClick={handleOpen}>
                    <DeleteTwoTone style={{ fontSize: '18px' }} />
                </a>
            </Tooltip>
            {open && (
                <Delete
                    registration_key={registration_key}
                    open={open}
                    onClose={handleClose}
                />
            )}
        </>
    )
}
