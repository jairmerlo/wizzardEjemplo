import { ErrorMessage, Formik } from "formik"
import logo from "../img/logo.svg"
import * as Yup from "yup"
import { Button, Col, DatePicker, Form, InputNumber, Modal, Row } from "antd"
import { Input, Select, Checkbox } from "formik-antd"
import { useCss } from "react-use"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  useGetListCountryQuery,
  useGetTrialDaysQuery,
} from "../../../app/api/billing"

export const PaymentDetails = () => {
  const { data = [] } = useGetListCountryQuery()
  const { data: days = "" } = useGetTrialDaysQuery()

  const optionsCountry = data.map(({ id, name }) => {
    return {
      label: name,
      value: id,
    }
  })

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

                  <Formik
                    enableReinitialize
                    onSubmit={(values) => {
                      console.log({ values })
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
                                picker="month"
                                name="month"
                                bordered={false}
                                placeholder="MM/YY"
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
