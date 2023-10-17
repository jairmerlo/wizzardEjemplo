import { Button, Typography } from "antd"
import { IDXCard, IDXCardContent } from "../../customers/components"
import { useCss } from "react-use"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { useSaveHtmlWizardMutation } from "../../../app/api/billing"
import { Loader } from "./Loader"
import { useState } from "react"

export const Rocket = () => {
  const button = useCss({
    fontWeight: "600",
    padding: "12px 30px",
    marginLeft: "10px",
    // padding: '7px 20px',
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "5px",
    minHeight: "50px",
  })
  const [loader, setLoader] = useState(false)

  const [saveHtmlWizard] = useSaveHtmlWizardMutation()
  const { customerData, paymentsDetails } = useSelector((state) => state.stripe)
  const redirigirAURL = async () => {
    setLoader(true)
    await saveHtmlWizard({
      payment_html: "",
      program_html: "",
      registration_key: paymentsDetails.registration_key,
      initial_price: paymentsDetails.initial_price,
      plan_code: paymentsDetails.plan_code,
      monthly_price: paymentsDetails.monthly_price,
      email: customerData.email,
    })
    window.location.href = paymentsDetails.url_cpanel
  }
  return (
    <IDXCard style={{ width: "500px", height: "280px" }}>
      <IDXCardContent
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            margin: "auto",
            width: "100px",
            height: "100px",
            transform: "rotate(-45deg)",
          }}
        >
          <svg id="rocket-icon" viewBox="0 0 75 75">
            <polygon fill="#ef3d4e" points="18 21 35 21 44 30 27 30" />
            <polygon fill="#ae2865" points="27 45 44 45 35 54 18 54" />
            <path
              fill="#ae2865"
              d="M30.94 47.7c-3.79-.93-6.98-2.35-9.25-4.07a14.88 14.88 0 0 0 0-12.26c2.27-1.72 5.46-3.14 9.25-4.08A14.72 14.72 0 0 1 35 37.5c0 3.98-1.55 7.59-4.06 10.2z"
            />
            <path
              fill="#ef3d4e"
              d="M30.94 27.3c-3.79.93-6.98 2.35-9.25 4.07.84 1.86 1.31 3.94 1.31 6.13h12c0-3.98-1.55-7.59-4.06-10.2z"
            />
            <path
              fill="#ae2865"
              d="M57.06 30.13C62.5 33.1 66 36.73 66 37.5c0 .77-3.49 4.4-8.94 7.37A14.83 14.83 0 0 0 59 37.5c0-2.7-.7-5.21-1.94-7.37z"
            />
            <path
              fill="#ef3d4e"
              d="M57.06 30.13C62.5 33.1 66 36.73 66 37.5h-7c0-2.7-.7-5.21-1.94-7.37z"
            />
            <path
              fill="#ECFAFF"
              d="M57.06 44.87C52.94 47.12 47.7 49 42 49c-3.99 0-7.75-.47-11.06-1.3A14.72 14.72 0 0 0 35 37.5c0-3.98-1.55-7.59-4.06-10.2C34.25 26.46 38.01 26 42 26c5.7 0 10.94 1.88 15.06 4.13A14.83 14.83 0 0 1 59 37.5c0 2.7-.7 5.21-1.94 7.37z"
            />
            <path
              fill="#FCFEFF"
              d="M57.06 30.13C52.94 27.88 47.7 26 42 26c-3.99 0-7.75.47-11.06 1.3A14.72 14.72 0 0 1 35 37.5h24c0-2.7-.7-5.21-1.94-7.37z"
            />
            <circle cx="49.5" cy="37.5" r="3.5" fill="#ae2865" />
            <path fill="#ef3d4e" d="M46 37.5h7a3.5 3.5 0 0 0-7 0z" />
            <path
              fill="#face00"
              d="M21 37.5c0-10.04-11 0-12 0 1 0 12 10.04 12 0z"
              className="flame"
            />
          </svg>
        </div>
        <Typography.Title level={5}>
          You are one step closer to acquiring the only real state website
          <br />
          you will ever need
        </Typography.Title>
        <Button
          type="primary"
          onClick={redirigirAURL}
          className={button}
          style={{
            backgroundImage: "linear-gradient(to right,#ef3d4e,#ae2865)",
          }}
        >
          FINISH YOUR SETUP
        </Button>
      </IDXCardContent>
      {loader && <Loader />}
    </IDXCard>
  )
}
