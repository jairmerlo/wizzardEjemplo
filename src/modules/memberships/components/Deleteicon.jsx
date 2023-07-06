import { Tooltip } from "antd"
import { useState } from "react"
import { Delete } from "./Delete"
import '../../../icons/style.css'

export const Deleteicon = ({ registration_key }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)
    return (
        <>
            <Tooltip title='Delete'>
                <button className="buttonLink" onClick={handleOpen}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: '#858faf',
                            fontSize: '10px'
                        }}
                    >
                        <span className='back-office-delete' style={{ fontSize: '20px' }}></span>
                        DELETE
                    </div>
                </button>
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
