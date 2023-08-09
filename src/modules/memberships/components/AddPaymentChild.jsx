import { Formik, ErrorMessage } from "formik"
import { Input, Select, Form } from "formik-antd"
import moment from "moment"
import * as Yup from "yup"
import {
  Button,
  Divider,
  Modal,
  Typography,
  Upload,
  message,
  notification,
} from "antd"
import { useCss } from "react-use"
import { UploadOutlined } from "@ant-design/icons"
import { useState } from "react"
import TextArea from "antd/es/input/TextArea"
import {
  useGetPlanByregistrationKeyV2Query,
  useGetProviderAccountQuery,
} from "../../../app/api/billing"
import { useAddPaymentMutation } from "../../../app/api/backoffice"

export const AddPaymentChild = ({
  open = false,
  handleClose = (f) => f,
  registration_key = "",
}) => {
  const { data: plans = [] } = useGetPlanByregistrationKeyV2Query({
    registration_key,
  })
  // console.log({ plans })

  const { data: providers = [] } = useGetProviderAccountQuery()
  // console.log({ providers })
  const [addPayment, { isLoading: isLoadingPayment }] = useAddPaymentMutation()

  const [urlFile, setUrlFile] = useState("")

  const form = useCss({
    display: "grid",
    gridTemplateColumns: "49% 49%",
    columnGap: "16px",
    rowGap: "10px",
    "& > .ant-form-item": {
      margin: "0px",
    },
    "@media only screen and (max-width: 745px)": {
      gridTemplateColumns: "1fr",
    },
  })
  const form2 = useCss({
    display: "grid",
    margin: "20px 0",
    gridTemplateColumns: "1fr 1fr 1fr",
    columnGap: "50px",
    rowGap: "20px",
    "& > .ant-form-item": {
      margin: "0px",
    },
    "@media only screen and (max-width: 745px)": {
      gridTemplateColumns: "1fr",
    },
  })

  const item = useCss({
    width: "200px",
    padding: "7px 20px",
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "25px",
    minHeight: "50px",
  })

  const item2 = useCss({
    padding: "7px 20px",
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "15px",
    height: "150px",
    width: "350px",
  })

  const button = useCss({
    fontWeight: "600",
    padding: "12px 30px",
    marginLeft: "10px",
    // padding: '7px 20px',
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "25px",
    minHeight: "50px",
  })

  const upLoadFile = async (file) => {
    console.log({ file })
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("registration_key", registration_key)

      const res = await fetch(
        "https://api-billing.idxboost.dev/api/upload-file",
        {
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json())

      console.log({ res })
      setUrlFile(res)

      // if (!response.ok) {
      //     const errorMessage = await response.text();
      //     throw new Error(errorMessage);
      // }
    } catch (error) {
      console.error("Error al enviar el archivo:", error.message)
    }
  }

  function formatNumberWithCommas(number) {
    if (!Number.isNaN(number)) {
      return number.toLocaleString()
    } else {
      return ""
    }
  }

  return (
    <Modal
      title="Add Payment"
      open={open}
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
      width={800}
      centered
      destroyOnClose
    >
      <Divider />
      <Formik
        onSubmit={(values) => {
          console.log({ values })
          addPayment({
            registration_key,
            paidDate: values.paidDate,
            amount: values.amount,
            invoiceNumber: values.invoiceNumber,
            invoicePeriodInit: values.invoicePeriodInit,
            invoicePeriodEnd: values.invoicePeriodEnd,
            sourcePayment: values.sourcePayment,
            programName: values.programName,
            programCode: values.programCode,
            attachFile: urlFile,
            note: values.note,
          })
            .then(({ data }) => {
              notification.success({
                message: `Success`,
                description: "Payment successfully added!",
                placement: "bottomRight",
              })
              handleClose()
              // navigate(-1)
            })
            .catch(console.log)
        }}
        enableReinitialize
        initialValues={{
          paidDate: moment(new Date()).format("YYYY-MM-DD"),
          amount: "",
          invoiceNumber: "",
          invoicePeriodInit: moment(new Date()).format("YYYY-MM"),
          invoicePeriodEnd: moment(new Date()).format("YYYY-MM"),
          sourcePayment: "",
          programName: "",
          programCode: "",
          note: "",
          fileAttach: "",
        }}
        validationSchema={Yup.object({
          paidDate: Yup.date().required("This field is required."),
          amount: Yup.string().required("This field is required."),
          invoiceNumber: Yup.string().required("This field is required."),
          invoicePeriodInit: Yup.date().required("This field is required."),
          invoicePeriodEnd: Yup.date().required("This field is required."),
          sourcePayment: Yup.string().required("This field is required."),
          programName: Yup.string().required("This field is required."),
          note: Yup.string(),
          fileAttach: Yup.mixed(),
        })}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <>
            <div className={form2}>
              <Form.Item
                label="Paid Date"
                required
                validateStatus={errors.paidDate && touched.paidDate && "error"}
                help={<ErrorMessage name="paidDate" />}
              >
                <Input className={item} name="paidDate" type="date" />
              </Form.Item>
              <Form.Item
                label="$ Amount"
                required
                validateStatus={errors.amount && touched.amount && "error"}
                help={<ErrorMessage name="amount" />}
              >
                <Input
                  name="amount"
                  className={item}
                  type="text"
                  min={0}
                  onChange={(e) => {
                    const value = parseInt(
                      e.target.value.replace(/\D/g, ""),
                      10
                    )
                    const formattedValue = formatNumberWithCommas(value)
                    console.log({ formattedValue })
                    setFieldValue("amount", formattedValue)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Invoice#"
                required
                validateStatus={
                  errors.invoiceNumber && touched.invoiceNumber && "error"
                }
                help={<ErrorMessage name="invoiceNumber" />}
              >
                <Input name="invoiceNumber" className={item} type="text" />
              </Form.Item>
            </div>
            <Typography.Title level={5}>Invoice Period:</Typography.Title>
            <div className={form2}>
              <Form.Item
                label="Init"
                required
                validateStatus={
                  errors.invoicePeriodInit &&
                  touched.invoicePeriodInit &&
                  "error"
                }
                help={<ErrorMessage name="invoicePeriodInit" />}
              >
                <Input name="invoicePeriodInit" className={item} type="month" />
              </Form.Item>
              <Form.Item
                label="End"
                required
                validateStatus={
                  errors.invoicePeriodEnd && touched.invoicePeriodEnd && "error"
                }
                help={<ErrorMessage name="invoicePeriodEnd" />}
              >
                <Input name="invoicePeriodEnd" className={item} type="month" />
              </Form.Item>
            </div>
            <div className={form2}>
              <Form.Item
                label="Source Payment"
                required
                validateStatus={
                  errors.sourcePayment && touched.sourcePayment && "error"
                }
                help={<ErrorMessage name="sourcePayment" />}
              >
                <Select
                  bordered={false}
                  className={item}
                  allowClear
                  name="sourcePayment"
                  options={providers}
                  // onChange={() => {
                  //     setFieldValue('has_trial', 0)
                  //     setFieldValue('trial_length', '')
                  // }}
                />
              </Form.Item>
              <Form.Item
                label="Program/Product"
                required
                validateStatus={
                  errors.programName && touched.programName && "error"
                }
                help={<ErrorMessage name="programName" />}
              >
                <Select
                  bordered={false}
                  className={item}
                  allowClear
                  name="programName"
                  options={plans}
                  onChange={(value) => {
                    const code =
                      plans.find(({ label }) => label === value)?.code || ""
                    setFieldValue("programCode", code)
                  }}
                />
              </Form.Item>
              <Form.Item
                label="Attach File"
                validateStatus={
                  errors.fileAttach && touched.fileAttach && "error"
                }
                help={<ErrorMessage name="fileAttach" />}
              >
                <input
                  type="file"
                  name="fileAttach"
                  onChange={(event) => {
                    const file = event.currentTarget.files[0]
                    upLoadFile(file)
                  }}
                />
              </Form.Item>
            </div>

            <div className={form}>
              <Form.Item
                label="Note"
                validateStatus={errors.note && touched.note && "error"}
                help={<ErrorMessage name="note" />}
              >
                <Input.TextArea
                  className={item2}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  name="note"
                  // type='text'
                />
              </Form.Item>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: 8,
                paddingTop: 30,
              }}
            >
              <Button className={button} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="primary"
                // onClick={handleSubmit}
                onClick={handleSubmit}
                loading={isLoadingPayment}
                className={button}
                style={{
                  backgroundImage: "linear-gradient(to right,#ef3d4e,#ae2865)",
                }}
              >
                Save
              </Button>
            </div>
          </>
        )}
      </Formik>
    </Modal>
  )
}
