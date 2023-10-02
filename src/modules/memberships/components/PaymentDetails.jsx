import { ErrorMessage, Formik } from "formik"
import logo from "../img/logo.svg"
import * as Yup from "yup"
import { Button, Col, DatePicker, Form, InputNumber, Modal, Row } from "antd"
import { Input, Select, Checkbox } from "formik-antd"
import { useCss } from "react-use"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  useGetItemToSubscriptionByProgramQuery,
  useGetListCountryQuery,
  useGetTrialDaysQuery,
  usePaymentMethodMutation,
  useRegisterBillingV2Mutation,
  useSaveHtmlWizardMutation,
  useUpdateCustomerMutation,
} from "../../../app/api/billing"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { setPaymentsDetails } from "../../../app/stripe"
import {
  AddressElement,
  CardElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"

export const PaymentDetails = () => {
  const dispatch = useDispatch()
  const { data = [] } = useGetListCountryQuery()
  const { data: days = "" } = useGetTrialDaysQuery()
  const { data: items = [] } = useGetItemToSubscriptionByProgramQuery({
    plan_code: "IDXB-P0003-TRIAL-d22905b5",
  })
  const optionsCountry = data.map(({ id, name }) => {
    return {
      label: name,
      value: id,
    }
  })
  const [paymentMethod] = usePaymentMethodMutation()
  const [updateCustomer] = useUpdateCustomerMutation()
  const { customerData } = useSelector((state) => state.stripe)
  const navigate = useNavigate()

  const [registerBillingV2] = useRegisterBillingV2Mutation()
  // useSaveHtmlWizardMutation
  const item = useCss({
    width: "450px",
    height: "60px",
    padding: "7px 20px",
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "30px",
    backgroundColor: "white",
  })

  const item2 = useCss({
    width: "450px",
    height: "60px",
    padding: "7px 20px",
    fontSize: "16px",
    color: "white",
    border: "1px solid #e4e4e4",
    borderRadius: "30px",
    background: "linear-gradient(45deg, #ef3d4e 0%, #ae2865)",
  })

  const item3 = useCss({
    width: "450px",
    height: "60px",
    display: "flex",
    padding: "7px 20px",
    border: "1px solid #e4e4e4",
    borderRadius: "30px",
    backgroundColor: "white",
    alignItems: "center",
  })

  const [cvc, setCVC] = useState("")

  const handleCVCChange = (e) => {
    let value = e.target.value

    value = value.replace(/\D/g, "")
    value = value.slice(0, 4)

    setCVC(value)
  }

  const [cardNumber, setCardNumber] = useState("")

  const handleCardNumberChange = (e) => {
    let value = e.target.value
    value = value.replace(/\s+/g, "").replace(/\D/g, "")
    value = value.replace(/(.{4})/g, "$1 ")

    if (value.length > 19) {
      value = value.slice(0, 19)
    }

    setCardNumber(value)
    return value
  }

  const handleDateChange = (date, dateString) => {
    if (date) {
      const formattedDate = moment(date).format("MM/YYYY")
      return formattedDate
    }
  }

  const stripe = useStripe()
  const elements = useElements()

  const createToken = async () => {
    const cardElement = elements.getElement(CardElement)

    const { token, error } = await stripe.createToken(cardElement, {
      name: "prueba",
    })

    if (!error) {
      console.log(token)
      return token
    } else {
      console.log(error)
    }
  }

  return (
    <div className="ms-new-lt-format">
      <div className="rs-wrapper">
        <section className="rs-content-wrapper onboarding-form -billing-information">
          <div className="ms-wrap-billing-form ms-card-form">
            <div className="ms-card-form">
              <div className="ms-card-information">
                <div className="ms-lateral-format">
                  <div className="ms-wrapper-lateral-format">
                    <div
                      style={{
                        backgroundColor: "#00d900",
                        borderRadius: "25px",
                        color: "black",
                        fontSize: "30px",
                      }}
                    >
                      Why we ask your cc
                    </div>
                  </div>
                </div>
                <video
                  id="videoActiveFull"
                  src="https://www.idxboost.com/wp-content/uploads/2023/06/new_home_video_min.mp4"
                  title="Welcome IDXBoost"
                  muted
                  autoPlay
                  loop
                  playsInline
                  onContextMenu={() => false}
                ></video>
              </div>

              <div className="ms-card-list">
                {/* <img src="img/logo.svg" alt="IDXBoost" className="ms-mlogo" /> */}

                <div className="ms-card" id="card-b2">
                  <div className="ms-header-block-a">
                    <h3 className="ms-block-title">Payment Details</h3>
                    <h4 className="ms-block-subtitle">
                      This is to verify your account,{" "}
                      <strong>you will not be charged</strong> <br />
                      <strong>during your {days} days free trial</strong>
                    </h4>
                  </div>
                  {/* <form className="formDetailsPaymernt" onSubmit={handleSubmit}>
                    <div className="formStripe">
                      <CardElement
                        className={item}
                        options={{
                          hidePostalCode: true,
                        }}
                      />
                    </div>
                    <button className={item2} type="submit">
                      <strong>Pay</strong>
                    </button>
                    <span style={{ margin: "10px", color: "#919191" }}>
                      @2023 IDXBoost, LLC All rights Reserved.
                    </span>
                  </form> */}

                  <Formik
                    enableReinitialize
                    onSubmit={async (values) => {
                      console.log({ values })
                      const token = await createToken()
                      console.log({ token })
                      const { data: dataPayment } = await paymentMethod({
                        customerId: customerData.customer_id,
                        items,
                        token: token.id,
                      })
                      console.log({ dataPayment })
                      const { data = {} } = await registerBillingV2({
                        type: "trial",
                        name: customerData.full_name,
                        last_name: "",
                        email: customerData.email,
                        phone: customerData.phone,
                        customer_id: customerData.customer_id,
                        checkout_session_id: customerData.checkout_session_id,
                        password: customerData.password,
                        ip: customerData.ip,
                        country: customerData.country,
                        city: customerData.city,
                      })
                      console.log({ data })
                      updateCustomer({
                        customerId: customerData.customer_id,
                        metadata: {
                          company: data.company,
                          registration_key: data.registration_key,
                          membership_id: data.membership_id,
                          customerId: customerData.customer_id,
                        },
                      })
                      // data aca viaja company
                      // registration_key
                      // membership_id
                      // customer_uuid
                      dispatch(
                        setPaymentsDetails({
                          card_holder: values.cardHolder,
                          card_number: values.cardNumber,
                          company_name: values.companyName,
                          country: values.country,
                          cvc: values.cvc,
                          month: values.month,
                          url_cpanel: data.url_cpanel,
                          registration_key: data.registration_key,
                          membership_id: data.membership_id,
                          initial_price: data.initial_price,
                          monthly_price: data.monthly_price,
                          plan_code: data.plan_code,
                        })
                      )
                      navigate("/membership-creation")
                    }}
                    initialValues={{
                      companyName: "",
                      cardHolder: "",
                      cardNumber: "",
                      month: "",
                      cvc: "",
                      country: "",
                    }}
                    validationSchema={Yup.object({
                      companyName: Yup.string(),
                      cardHolder: Yup.string().required(
                        "Card Holder is required"
                      ),
                      country: Yup.string().required("Country is required"),
                      // cvc: Yup.number().min(4, "CVC must contain 4 characters"),
                    })}
                  >
                    {({
                      errors,
                      touched,
                      handleSubmit,
                      setFieldValue,
                      values,
                    }) => (
                      <>
                        <Form.Item
                          validateStatus={
                            errors.companyName && touched.companyName && "error"
                          }
                          help={<ErrorMessage name="companyName" />}
                        >
                          <Input
                            name="companyName"
                            placeholder="Company Name (optional)"
                            className={item}
                          />
                        </Form.Item>
                        <Form.Item
                          validateStatus={
                            errors.cardHolder && touched.cardHolder && "error"
                          }
                          help={<ErrorMessage name="cardHolder" />}
                        >
                          <Input
                            name="cardHolder"
                            placeholder="Card Holder Full Name"
                            className={item}
                          />
                        </Form.Item>
                        <CardElement
                          className={item}
                          style={{
                            margin: "0px 0px 15px 0px",
                          }}
                          options={{
                            hidePostalCode: true,
                          }}
                        />
                        <Form.Item
                          validateStatus={
                            errors.ipConfig && touched.ipConfig && "error"
                          }
                          style={{
                            marginTop: "20px",
                          }}
                          help={<ErrorMessage name="ipConfig" />}
                          className={item}
                        >
                          <Select
                            name="country"
                            options={optionsCountry}
                            placeholder="Country"
                            bordered={false}
                          />
                        </Form.Item>
                        <Button className={item2} onClick={handleSubmit}>
                          <strong>Pay</strong>
                        </Button>
                        <span style={{ margin: "10px", color: "#919191" }}>
                          @2023 IDXBoost, LLC All rights Reserved.
                        </span>
                        <Button
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#40a2d9",
                          }}
                        >
                          Why do we need your credit card?
                        </Button>
                      </>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
