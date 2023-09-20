import { ErrorMessage, Formik } from "formik"
import logo from "../img/logo.svg"
import * as Yup from "yup"
import { Button, Form, Modal } from "antd"
import { Input as FormikInput, Select, Checkbox } from "formik-antd"
import { useCss } from "react-use"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  useAbandonedCardStep1Mutation,
  useGetCustomerIdMutation,
  useGetTrialDaysQuery,
  useProcessNotificationStep1Mutation,
} from "../../../app/api/billing"
import { useDispatch } from "react-redux"
import { setCustomerData } from "../../../app/stripe"

export const SingupTrial = () => {
  const [openModal, setOpenModal] = useState(false)
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const apiKey =
    "sk_test_51MPGWNBfWCdjsfM6CMb9F0usz8kDDHFbkHNeboVwypSGaghon8zpRghKy9NDiTI6ZyztD4g1kmYl4idWdKxLSD6t00nZnfkeIF"
  const [getCustomerId] = useGetCustomerIdMutation()
  const userInformation = async () => {
    const response = await fetch("http://ip-api.com/json")
    const data = await response.json()
    return data
  }

  const { data: days = "" } = useGetTrialDaysQuery()
  const [abandonedCardStep1] = useAbandonedCardStep1Mutation()
  const [processNotificationStep1] = useProcessNotificationStep1Mutation()
  const item = useCss({
    width: "450px",
    height: "60px",
    padding: "7px 20px",
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "30px",
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

  const logoModal = useCss({
    width: "250px",
    height: "auto",
    display: "block",
    margin: "0 auto 30px auto",
  })

  const [phoneNumber, setPhoneNumber] = useState("")

  const formatPhoneNumber = (value) => {
    const phoneNumberDigits = value.replace(/\D/g, "")

    let formattedPhoneNumber = ""

    if (phoneNumberDigits.length >= 1) {
      formattedPhoneNumber = `(${phoneNumberDigits.slice(0, 3)}`
    }

    if (phoneNumberDigits.length > 3) {
      formattedPhoneNumber += `) ${phoneNumberDigits.slice(3, 6)}`
    }

    if (phoneNumberDigits.length > 6) {
      formattedPhoneNumber += `-${phoneNumberDigits.slice(6, 10)}`
    }

    return formattedPhoneNumber.slice(0, 14)
  }

  const handleInputChange = (e) => {
    const formattedValue = formatPhoneNumber(e.target.value)
    setPhoneNumber(formattedValue)
  }

  return (
    <>
      <div className="ms-new-lt-format">
        <div className="rs-wrapper">
          <section className="rs-content-wrapper onboarding-form -billing-information">
            <div className="ms-wrap-billing-form ms-card-form">
              <div className="ms-card-form">
                <div className="ms-card-information">
                  <div className="ms-lateral-format">
                    <div className="ms-wrapper-lateral-format">
                      <img src={logo} alt="IDXBoost" className="ms-mlogo" />
                      <h3 className="ms-mtitle">
                        Building better real estate websites that convert
                        quality leads
                      </h3>

                      <div className="ms-wrapper-video">
                        <div className="ms-temporal-video">
                          <video loop autoPlay muted playsInline preload="auto">
                            <source
                              src="https://www.idxboost.com/wp-content/uploads/2023/06/home_preview_min.mp4"
                              type="video/mp4"
                            />
                          </video>
                          <button
                            className="ms-play-video js-play-video-tm"
                            data-video="https://www.idxboost.com/wp-content/uploads/2023/06/new_home_video_min.mp4"
                            aria-label="Show this video"
                          ></button>
                        </div>
                        <div className="ms-full-video">
                          <button
                            className="ms-btn -pause js-action-video-tm"
                            data-type="pause"
                            aria-label="Play Video"
                          ></button>
                          <button
                            className="ms-btn -close js-action-video-tm"
                            data-type="close"
                            aria-label="Close Video"
                          ></button>
                          <div className="ms-video-cover"></div>
                        </div>
                      </div>

                      <div className="ms-mtfotter">
                        <span>
                          By registering you agree to our{" "}
                          <a
                            href="facebook.com"
                            target="_blank"
                            className="ms-link"
                          >
                            term of use
                          </a>
                        </span>
                        <ul className="ms-mt-social">
                          <li>
                            <a
                              href="facebook.com"
                              className="ms-icon-facebook"
                              rel="noreferrer"
                            >
                              Facebook
                            </a>
                          </li>
                          <li>
                            <a
                              href="facebook.com"
                              className="ms-icon-twitter"
                              rel="noreferrer"
                            >
                              Twitter
                            </a>
                          </li>
                          <li>
                            <a
                              href="facebook.com"
                              className="ms-icon-instagram"
                              rel="noreferrer"
                            >
                              Instagram
                            </a>
                          </li>
                          <li>
                            <a
                              href="facebook.com"
                              className="ms-icon-pinterest"
                              rel="noreferrer"
                            >
                              Pinterest
                            </a>
                          </li>
                          <li>
                            <a
                              href="facebook.com"
                              className="ms-icon-google"
                              rel="noreferrer"
                            >
                              Google+
                            </a>
                          </li>
                          <li>
                            <a
                              href="facebook.com"
                              className="ms-icon-youtube"
                              rel="noreferrer"
                            >
                              Youtube
                            </a>
                          </li>
                        </ul>
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
                      <h3 className="ms-block-title">Sign Up</h3>
                      <h4 className="ms-block-subtitle">
                        Try IDXBoost™ Real Estate <br />
                        Website Builder <strong>Free For {days} Days!</strong>
                      </h4>
                    </div>

                    <Formik
                      enableReinitialize
                      onSubmit={async (values) => {
                        // console.log({ values })

                        // const { id = "" } = getCustomerId({
                        //   apiKey,
                        //   description: "",
                        //   email: values.email,
                        // })

                        const res = await userInformation()
                        const { data = {} } = await abandonedCardStep1({
                          customer_id: "cus_OXbOb3gjFaAWOp",
                          type: "trial",
                          url_origin:
                            "https://signup.idxboost.dev/standard/IDXB-P0003/1/notSeller/trial",
                          name: values.full_name,
                          email: values.email,
                          phone: values.phone,
                          country: res.country,
                          city: res.city,
                        })

                        processNotificationStep1({
                          type: "trial",
                          first_name: values.full_name,
                          last_name: "",
                          email: values.email,
                          phone: values.phone,
                        })

                        dispatch(
                          setCustomerData({
                            full_name: values.full_name,
                            phone: values.phone,
                            email: values.email,
                            password: values.password,
                            country: res.country,
                            city: res.city,
                            ip: res.query,
                            customer_id: "",
                            checkout_session_id: data.checkout_session_id,
                          })
                        )

                        navigate("/payment-details")
                      }}
                      initialValues={{
                        full_name: "",
                        phone: "",
                        email: "",
                        password: "",
                      }}
                      validationSchema={Yup.object({
                        full_name: Yup.string().required(
                          "Full Name is required"
                        ),
                        phone: Yup.string().required("Number is required"),
                        email: Yup.string()
                          .required("Email is required")
                          .email("Invalid email format"),
                        password: Yup.string()
                          .required("Password is required")
                          .min(8, "Password must contain 8 or more characters"),
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
                              errors.full_name && touched.full_name && "error"
                            }
                            help={<ErrorMessage name="full_name" />}
                          >
                            <FormikInput
                              name="full_name"
                              placeholder="Full Name"
                              className={item}
                            />
                          </Form.Item>
                          <Form.Item
                            validateStatus={
                              errors.phone && touched.phone && "error"
                            }
                            help={<ErrorMessage name="phone" />}
                          >
                            <FormikInput
                              className={item}
                              name="phone"
                              placeholder="(123) 123-1234"
                              type="text"
                              value={phoneNumber}
                              onChange={handleInputChange}
                              maxLength="14"
                            />
                          </Form.Item>
                          <Form.Item
                            validateStatus={
                              errors.email && touched.email && "error"
                            }
                            help={<ErrorMessage name="email" />}
                          >
                            <FormikInput
                              name="email"
                              placeholder="Email"
                              className={item}
                            />
                          </Form.Item>
                          <Form.Item
                            validateStatus={
                              errors.password && touched.password && "error"
                            }
                            help={<ErrorMessage name="password" />}
                          >
                            <FormikInput.Password
                              name="password"
                              placeholder="Password"
                              className={item}
                            />
                          </Form.Item>
                          <Button className={item2} onClick={handleSubmit}>
                            <strong>Confirm &amp; Pay</strong>
                          </Button>
                          <span style={{ margin: "10px", color: "#919191" }}>
                            @2023 IDXBoost, LLC All rights Reserved.
                          </span>
                          <Button
                            onClick={handleOpen}
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
      <Modal
        open={openModal}
        okButtonProps={{
          style: {
            display: "none",
          },
        }}
        cancelButtonProps={{
          style: {
            display: "none",
          },
        }}
        onCancel={handleClose}
        width={540}
        centered
        destroyOnClose
      >
        <img src={logo} alt="IDXBoost" class={logoModal} />
        <h5
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          Why do we need your credit card?
        </h5>
        <div style={{ fontSize: "16px" }}>
          <p>
            <strong>
              You might be wondering why we ask for a credit card to if the 15
              day trial is 100% free.
            </strong>{" "}
            At IDXBoostTM we pride on providing our members with unrivaled
            customer support. For this reason is crucial for us to avoid long
            support waiting times caused by many users who don't plan to use the
            product.
          </p>
          <p>
            Once you proceed with this step you will have full access to the
            website builder and you will receive premium support to help you
            with the basics to launch your website in a timely manner.
          </p>
          <p>You can cancel at anytime within your trial period.</p>
          <p>
            If you would like to get a demo before signing in just schedule your
            free training with our support & design team!
          </p>
        </div>
      </Modal>
    </>
  )
}
