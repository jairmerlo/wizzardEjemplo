import { ErrorMessage, Formik } from "formik"
import * as Yup from "yup"
import { Button, Form } from "antd"
import { Input, Select } from "formik-antd"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  useGetListCountryQuery,
  useGetTrialDaysQuery,
  usePaymentMethodMutation,
  useRegisterBillingV2Mutation,
  useUpdateCustomerMutation,
} from "../../../app/api/billing"
import { useDispatch, useSelector } from "react-redux"
import { setPaymentsDetails } from "../../../app/stripe"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { API } from "../../../api"
import { Loader } from "./Loader"

export const PaymentDetails = () => {
  const dispatch = useDispatch()
  const { data = [] } = useGetListCountryQuery()
  const { data: trialDays = "" } = useGetTrialDaysQuery()
  const [loader, setLoader] = useState(false)

  const datosSuscription = async (plan_code) => {
    let items = []
    let days = 1
    while (items.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const res = await fetch(
        API._BILLING_HOST + "/get-item-to-subscription-byprogram",
        {
          method: "POST",
          body: JSON.stringify({
            plan_code,
          }),
        }
      ).then((res) => res.json())
      items = res.items
      days = res.days
    }

    return {
      items,
      days,
      months: 1,
    }
  }

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

  const stripe = useStripe()
  const elements = useElements()
  const name = `${customerData.first_name} ${customerData.last_name}`

  const createToken = async () => {
    const cardElement = elements.getElement(CardElement)

    const { token, error } = await stripe.createToken(cardElement, {
      name: "prueba",
    })

    if (!error) {
      return token
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
                    {/* <div
                      style={{
                        backgroundColor: "#00d900",
                        borderRadius: "25px",
                        color: "black",
                        fontSize: "30px",
                      }}
                    >
                      Why we ask your cc
                    </div> */}
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
                      <strong>during your {trialDays} days free trial</strong>
                    </h4>
                  </div>
                  <Formik
                    enableReinitialize
                    onSubmit={async (values) => {
                      setLoader(true)
                      const token = await createToken()

                      const { data = {} } = await registerBillingV2({
                        project_name: values.companyName,
                        type: "trial",
                        name: customerData.first_name,
                        last_name: customerData.last_name,
                        email: customerData.email,
                        phone: customerData.phone,
                        customer_id: customerData.customer_id,
                        checkout_session_id: customerData.checkout_session_id,
                        password: customerData.password,
                        ip: customerData.ip,
                        country: customerData.country,
                        city: customerData.city,
                      })
                      const { items, days } = await datosSuscription(
                        data.plan_code
                      )

                      await paymentMethod({
                        customerId: customerData.customer_id,
                        items,
                        token: token.id,
                        days,
                      })
                      await updateCustomer({
                        customerId: customerData.customer_id,
                        name,
                        address: {
                          city: customerData.city,
                          country: customerData.country,
                          line1: null,
                          line2: null,
                          postal_code: null,
                          state: null,
                        },
                        metadata: {
                          company: data.company,
                          registration_key: data.registration_key,
                          membership_id: data.membership_id,
                          customer_uuid: data.customer_uuid,
                        },
                      })
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
                            className="itemForm"
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
                            className="itemForm"
                          />
                        </Form.Item>
                        <CardElement
                          className="itemForm3"
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
                          className="itemForm"
                        >
                          <Select
                            name="country"
                            options={optionsCountry}
                            placeholder="Country"
                            bordered={false}
                          />
                        </Form.Item>
                        <Button className="itemForm2" onClick={handleSubmit}>
                          <strong>Confirme & Pay</strong>
                        </Button>
                        <span style={{ margin: "10px", color: "#919191" }}>
                          @2023 IDXBoost, LLC All rights Reserved.
                        </span>
                        {/* <Button
                          style={{
                            backgroundColor: "transparent",
                            border: "none",
                            color: "#40a2d9",
                          }}
                        >
                          Why do we need your credit card?
                        </Button> */}
                      </>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {loader && <Loader />}
    </div>
  )
}
