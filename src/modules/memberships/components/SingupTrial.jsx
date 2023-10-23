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
import { Loader } from "./Loader"
import ReactPlayer from "react-player"

export const SingupTrial = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loader, setLoader] = useState(false)
  const [isVideoActive, setIsVideoActive] = useState(false)
  const [onPause, setOnPause] = useState(true)

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
                        Building better real estate websites
                        <br />
                        that convert quality leads
                      </h3>

                      <div
                        className={`ms-wrapper-video ${
                          isVideoActive ? "active" : ""
                        }`}
                      >
                        <div className="ms-temporal-video">
                          <video loop autoPlay muted playsInline preload="auto">
                            <source
                              src="https://www.idxboost.com/wp-content/uploads/2023/06/home_preview_min.mp4"
                              type="video/mp4"
                            />
                          </video>
                          <button
                            className="ms-play-video js-play-video-tm"
                            onClick={() => setIsVideoActive(true)}
                          ></button>
                        </div>
                        <div className="ms-full-video">
                          <button
                            className={`ms-btn ${
                              onPause ? "-pause" : "-play"
                            } js-action-video-tm`}
                            data-type="pause"
                            aria-label="Play Video"
                            onClick={() => setOnPause((c) => !c)}
                          ></button>
                          <button
                            className="ms-btn -close js-action-video-tm"
                            data-type="close"
                            aria-label="Close Video"
                            onClick={() => setIsVideoActive(false)}
                          ></button>
                          <div className="ms-video-cover">
                            {isVideoActive && (
                              <ReactPlayer
                                url="https://www.idxboost.com/wp-content/uploads/2023/06/new_home_video_min.mp4"
                                width="100%"
                                height="100%"
                                // controls
                                playing={onPause}
                                // muted
                                loop
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="ms-mtfotter">
                        <span>
                          By registering you agree to our{" "}
                          <a
                            href="https://www.idxboost.com/terms-of-use/"
                            rel="noreferrer"
                            target="_blank"
                            className="ms-link"
                          >
                            term of use
                          </a>
                        </span>
                        <ul className="ms-mt-social">
                          <li>
                            <a
                              href="https://www.facebook.com/people/IDX-Boost/100067195484020/"
                              rel="noreferrer"
                              className="ms-icon-facebook"
                              target="_blank"
                            >
                              Facebook
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.instagram.com/idxboost/"
                              className="ms-icon-instagram"
                              rel="noreferrer"
                              target="_blank"
                            >
                              Instagram
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.youtube.com/channel/UCEDMZ5H3JZC74Bydhkdm9HA"
                              className="ms-icon-youtube"
                              rel="noreferrer"
                              target="_blank"
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
                  <img src={logo} alt="IDXBoost" className="ms-mlogo" />

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
                        setLoader(true)
                        const { data: dataUser } = await getCustomerId({
                          apiKey,
                          name: `${values.first_name} ${values.last_name}`,
                          phone: values.phone,
                          email: values.email,
                          metadata: {
                            origin: "Wizard",
                            username: values.email,
                          },
                        })

                        const res = await userInformation()
                        const { data = {} } = await abandonedCardStep1({
                          customer_id: dataUser.id,
                          type: "trial",
                          url_origin:
                            "https://signup.idxboost.dev/standard/IDXB-P0003/1/notSeller/trial",
                          name: values.first_name,
                          last_name: values.last_name,
                          email: values.email,
                          phone: values.phone,
                          country: res.country,
                          city: res.city,
                        })

                        processNotificationStep1({
                          type: "trial",
                          first_name: values.first_name,
                          last_name: values.last_name,
                          email: values.email,
                          phone: values.phone,
                        })

                        dispatch(
                          setCustomerData({
                            first_name: values.first_name,
                            last_name: values.last_name,
                            // full_name: values.full_name,
                            phone: values.phone,
                            email: values.email,
                            password: values.password,
                            country: res.country,
                            city: res.city,
                            ip: res.query,
                            customer_id: dataUser.id,
                            checkout_session_id: data.checkout_session_id,
                          })
                        )

                        navigate("/payment-details")
                      }}
                      initialValues={{
                        first_name: "",
                        last_name: "",
                        // full_name: "",
                        phone: "",
                        email: "",
                        password: "",
                      }}
                      validationSchema={Yup.object({
                        first_name: Yup.string().required(
                          "First Name is required"
                        ),
                        last_name: Yup.string().required(
                          "Last Name is required"
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
                              errors.first_name && touched.first_name && "error"
                            }
                            help={<ErrorMessage name="first_name" />}
                          >
                            <FormikInput
                              name="first_name"
                              placeholder="First Name"
                              className="itemForm"
                            />
                          </Form.Item>
                          <Form.Item
                            validateStatus={
                              errors.last_name && touched.last_name && "error"
                            }
                            help={<ErrorMessage name="last_name" />}
                          >
                            <FormikInput
                              name="last_name"
                              placeholder="Last Name"
                              className="itemForm"
                            />
                          </Form.Item>
                          <Form.Item
                            validateStatus={
                              errors.phone && touched.phone && "error"
                            }
                            help={<ErrorMessage name="phone" />}
                          >
                            <FormikInput
                              className="itemForm"
                              name="phone"
                              placeholder="Phone"
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
                              className="itemForm"
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
                              className="itemForm"
                            />
                          </Form.Item>
                          <Button className="itemForm2" onClick={handleSubmit}>
                            <strong>Continue</strong>
                          </Button>
                          <span style={{ margin: "10px", color: "#919191" }}>
                            @2023 IDXBoost, LLC All rights Reserved.
                          </span>
                          {/* <Button
                            onClick={handleOpen}
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
      </div>
      {loader && <Loader />}
    </>
  )
}
