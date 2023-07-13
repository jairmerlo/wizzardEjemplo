import { Tooltip } from "antd"
import { useState } from "react"
import { Request } from "./Request"
import '../../../icons/style.css'

export const Requesticon = ({ registration_key, id }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>
            <Tooltip title='Request' className='itemGridToolbox'>
                <button className="itemButtonActions" onClick={handleOpen}>
                    <span className='back-office-requests' style={{ fontSize: '20px' }}></span>
                    REQUEST
                </button>
            </Tooltip>
            {open && (
                <Request
                    registration_key={registration_key}
                    idRequest={id}
                    open={open}
                    onClose={handleClose}
                />
            )}
        </>
    )
}
