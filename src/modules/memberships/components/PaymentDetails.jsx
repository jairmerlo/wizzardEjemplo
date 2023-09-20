import { ErrorMessage, Formik } from "formik"
import logo from "../img/logo.svg"
import * as Yup from "yup"
import { Button, Col, DatePicker, Form, InputNumber, Modal, Row } from "antd"
import { Input, Select, Checkbox } from "formik-antd"
import { useCss } from "react-use"
import { useState } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import {
  useGetItemToSubscriptionByProgramQuery,
  useGetListCountryQuery,
  useGetTrialDaysQuery,
  usePaymentMethodMutation,
  useRegisterBillingV2Mutation,
  useSaveHtmlWizardMutation,
} from "../../../app/api/billing"
import moment from "moment"
import { useDispatch, useSelector } from "react-redux"
import { setPaymentsDetails } from "../../../app/stripe"
import { CardElement, PaymentElement } from "@stripe/react-stripe-js"

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
  // usePaymentMethodMutation
  const { customerData } = useSelector((state) => state.stripe)
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
                  <form>
                    <CardElement />
                    <Button>Submit</Button>
                  </form>

                  {/* <Formik
                    enableReinitialize
                    onSubmit={async (values) => {
                      console.log({ values })
                      const { data = {} } = await registerBillingV2({
                        type: "trial",
                        name: customerData.full_name,
                        last_name: "",
                        email: customerData.email,
                        phone: customerData.phone,
                        customer_id: "cus_OXbOb3gjFaAWOp",
                        checkout_session_id: customerData.checkout_session_id,
                        password: customerData.password,
                        ip: customerData.ip,
                        country: customerData.country,
                        city: customerData.city,
                      })
                      console.log({ data })
                      dispatch(
                        setPaymentsDetails({
                          card_holder: values.cardHolder,
                          card_number: values.cardNumber,
                          company_name: values.companyName,
                          country: values.country,
                          cvc: values.cvc,
                          month: values.month,
                          url_cpanel: "",
                          registration_key: "",
                          membership_id: "",
                          initial_price: "",
                          monthly_price: "",
                          plan_code: "",
                        })
                      )
                      Navigate("/membership-creation")
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
                        <Form.Item
                          validateStatus={
                            errors.companyName && touched.companyName && "error"
                          }
                          help={<ErrorMessage name="companyName" />}
                          className={item3}
                        >
                          <Row>
                            <Col span={12}>
                              <Input
                                name="cardNumber"
                                placeholder="Card number"
                                bordered={false}
                                value={cardNumber}
                                onChange={(e) => {
                                  const value = handleCardNumberChange(e)
                                  setFieldValue("cardNumber", value)
                                }}
                              />
                            </Col>
                            <Col span={6}>
                              <DatePicker
                                name="month"
                                picker="month"
                                bordered={false}
                                placeholder="MM/YY"
                                onChange={(date) => {
                                  const dateFormat = handleDateChange(date)
                                  setFieldValue("month", dateFormat)
                                }}
                              />
                            </Col>
                            <Col span={4}>
                              <Input
                                name="cvc"
                                type="number"
                                placeholder="CVC"
                                bordered={false}
                                value={cvc}
                                onInput={handleCVCChange}
                              />
                            </Col>
                          </Row>
                        </Form.Item>
                        <Form.Item
                          validateStatus={
                            errors.ipConfig && touched.ipConfig && "error"
                          }
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
                  </Formik> */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
