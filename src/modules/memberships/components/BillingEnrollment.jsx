import { useState } from "react"
import "../../../icons/style.css"
import { BillingEnrollmentChild } from "./BillingEnrollmentChild"
import { Tooltip, notification } from "antd"

export const BillingEnrollment = ({
  registration_key = "",
  billingEnrollment = 0,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    if (!billingEnrollment) {
      notification.error({
        message:
          "You don't have the necessary permissions to use this function",
        placement: "bottomRight",
      })
      return
    }
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  return (
    <>
      <Tooltip title="Billing Enrollment" className="itemGridToolbox">
        <button className="itemButtonActions" onClick={handleOpen}>
          <span
            className="back-office-add-user"
            style={{ fontSize: "20px" }}
          ></span>
          <p style={{ textAlign: "center" }}>
            BILLING
            <br /> ENROLLMENT
          </p>
        </button>
      </Tooltip>
      {open && (
        <BillingEnrollmentChild
          open={open}
          handleClose={handleClose}
          registration_key={registration_key}
        />
      )}
    </>
  )
}
