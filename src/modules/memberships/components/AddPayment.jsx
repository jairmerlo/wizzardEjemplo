import { Tooltip } from "antd"
import { useState } from "react"
import { AddPaymentChild } from "./AddPaymentChild"

export const AddPayment = ({ registration_key = "" }) => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>
            <Tooltip title='Add Payment' className='itemGridToolbox'>
                <button
                    className='itemButtonActions'
                    onClick={handleOpen}
                >
                    <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
                    <p style={{ textAlign: 'center' }}>ADD
                        <br /> PAYMENT</p>
                </button>
            </Tooltip>
            {open && (
                <AddPaymentChild open={open} handleClose={handleClose} registration_key={registration_key} />
            )}
        </>
    )
}
