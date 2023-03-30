import { PullRequestOutlined } from "@ant-design/icons"
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
            <Tooltip title='Request'>
                <a onClick={handleOpen} href>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: '#858faf',
                            fontSize: '10px'
                        }}
                    >
                        <span className='back-office-requests' style={{ fontSize: '20px' }}></span>
                        REQUEST
                    </div>
                </a>
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
