import { useState } from "react"
import '../../../icons/style.css'
import { BillingEnrollmentChild } from "./BillingEnrollmentChild"
import { Tooltip } from "antd"

export const BillingEnrollment = ({ registration_key = "" }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)


    return (
        <>
            <Tooltip title='Billing Enrollment'>
                <a onClick={handleOpen}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            color: '#858faf',
                            fontSize: '10px'
                        }}
                    >
                        <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
                        <p style={{ textAlign: 'center' }}>BILLING
                            <br /> ENROLLMENT</p>
                    </div>
                </a>
            </Tooltip>
            {open && (
                <BillingEnrollmentChild open={open} handleClose={handleClose} registration_key={registration_key} />
            )}
        </>
    )
}
