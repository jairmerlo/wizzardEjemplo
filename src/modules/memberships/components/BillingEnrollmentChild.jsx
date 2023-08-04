import {
  useBillingEnrollmentMutation,
  useGetPlanByregistrationKeyQuery,
} from "../../../app/api/billing"
import { ErrorMessage, Formik } from "formik"
import * as Yup from "yup"
import { useCss } from "react-use"
import { Input, Select } from "formik-antd"
import { getConfig, getSelectSearchProps } from "../../../helpers"
import { Button, Divider, Form, Modal, Typography, notification } from "antd"
import moment from "moment"
import { useState } from "react"

export const BillingEnrollmentChild = ({
  open = false,
  handleClose = (f) => f,
  registration_key = "",
}) => {
  const userId = getConfig().userId
  console.log({ userId })
  const [openModal, setOpenModal] = useState(false)
  const handleCloseModal = () => setOpenModal(false)

  const [billingEnrollment, { isLoading: isLoadingBilling }] =
    useBillingEnrollmentMutation()
  const { data: programs = [] } = useGetPlanByregistrationKeyQuery({
    registration_key,
  })

  const form = useCss({
    display: "grid",
    gridTemplateColumns: "49% 49%",
    columnGap: "16px",
    rowGap: "30px",
    "& > .ant-form-item": {
      margin: "0px",
    },
    "@media only screen and (max-width: 745px)": {
      gridTemplateColumns: "1fr",
    },
  })

  const item = useCss({
    padding: "7px 20px",
    fontSize: "14px",
    border: "1px solid #e4e4e4",
    borderRadius: "25px",
    minHeight: "50px",
  })

  const item2 = useCss({
    padding: "7px 20px",
    fontSize: "14px",
    border: "3px solid #47aac5",
    borderRadius: "15px",
    minHeight: "50px",
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

  const form2 = useCss({
    display: "grid",
    margin: "20px 0",
    gridTemplateColumns: "1fr 1fr 1fr",
    columnGap: "150px",
    rowGap: "20px",
    "& > .ant-form-item": {
      margin: "0px",
    },
    "@media only screen and (max-width: 745px)": {
      gridTemplateColumns: "1fr",
    },
  })

  const today = new Date()
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  let yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  return (
    <Modal
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
      <Typography.Title level={4} style={{ fontWeight: "bold" }}>
        Billing Enrollment
      </Typography.Title>
      <Divider dashed />
      <Formik
        onSubmit={(values) => {
          console.log({ values })
          if (!openModal) {
            setOpenModal(true)
            return
          }

          billingEnrollment({
            registration_key,
            program_code: values.program_code,
            periods_setupfee: values.periods_setupfee,
            setupfee: values.programas.setupfee,
            startdate_setupfee: values.startdate_setupfee,
            periods_monthly: values.periods_monthly,
            monthly: values.programas.monthly,
            startdate_monthly: values.startdate_monthly,
            user_id: userId,
          })
            .then(({ data }) => {
              notification.success({
                message: `Success`,
                description:
                  "The subscription invoice will be issued and will be sent in approximately 1 hour.",
                placement: "bottomRight",
              })
              handleClose()
              // navigate(-1)
            })
            .catch(console.log)
        }}
        enableReinitialize
        initialValues={{
          // brokerage: companyEnrollment,
          programas: {},
          program_code: "",
          periods_setupfee: 1,
          periods_monthly: 1,
          startdate_setupfee: moment(today).format("YYYY-MM-DD"),
          startdate_monthly: moment(nextMonth).format("YYYY-MM-DD"),
        }}
        validationSchema={Yup.object({
          // brokerage: Yup.string().required('This field is required.'),
          program_code: Yup.string().required("This field is required."),
          startdate_setupfee: Yup.date().min(
            yesterday,
            "date must be greater than or equal to current date"
          ),
          startdate_monthly: Yup.date().min(
            Yup.ref("startdate_setupfee"),
            "date must be greater than or equal to setup fee date"
          ),
        })}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <>
            <Form layout="vertical" autoComplete="off">
              <div className={form}>
                <Form.Item
                  label="Program"
                  required
                  validateStatus={
                    errors.program_code && touched.program_code && "error"
                  }
                  help={<ErrorMessage name="program_code" />}
                >
                  <Select
                    bordered={false}
                    className={item}
                    name="program_code"
                    options={programs}
                    {...getSelectSearchProps()}
                    onChange={async (value) => {
                      let programSelected = await programs.find(
                        (program) => program.value === value
                      )

                      setFieldValue("programas", programSelected)
                    }}
                  />
                </Form.Item>
              </div>
              <div className={form2}>
                <Form.Item label="Setup Fee" required>
                  <Input
                    name={`programas.setupfee`}
                    className={item2}
                    type="number"
                    min={0}
                  />
                </Form.Item>
                <Form.Item label="Quantity" required>
                  <Input
                    name="periods_setupfee"
                    className={item2}
                    type="number"
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  label="Start Date"
                  required
                  validateStatus={
                    errors.startdate_setupfee &&
                    touched.startdate_setupfee &&
                    "error"
                  }
                  help={<ErrorMessage name="startdate_setupfee" />}
                >
                  <Input
                    className={item2}
                    name="startdate_setupfee"
                    placeholder="Publication Date"
                    type="date"
                  />
                </Form.Item>
                <Form.Item label="Monthly" required>
                  <Input
                    name={`programas.monthly`}
                    className={item2}
                    type="number"
                    min={0}
                  />
                </Form.Item>
                <Form.Item label="Quantity" required>
                  <Input
                    name="periods_monthly"
                    className={item2}
                    type="number"
                    min={1}
                  />
                </Form.Item>
                <Form.Item
                  label="Start Date"
                  required
                  validateStatus={
                    errors.startdate_monthly &&
                    touched.startdate_monthly &&
                    "error"
                  }
                  help={<ErrorMessage name="startdate_monthly" />}
                >
                  <Input
                    className={item2}
                    name="startdate_monthly"
                    placeholder="Publication Date"
                    type="date"
                  />
                </Form.Item>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: 30,
                }}
              >
                <Typography.Text level={5}>
                  Quantity: Amount of setup fee or monthly fee to be paid during
                  that period
                </Typography.Text>
                <div>
                  <Button className={button} onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    // onClick={handleSubmit}
                    onClick={handleSubmit}
                    loading={isLoadingBilling}
                    className={button}
                    style={{
                      backgroundImage:
                        "linear-gradient(to right,#ef3d4e,#ae2865)",
                    }}
                  >
                    Save
                  </Button>
                </div>
                <Modal
                  title="Are you sure?"
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
                  onCancel={handleCloseModal}
                  width={400}
                  centered
                  destroyOnClose
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button className={button} onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button
                      type="primary"
                      onClick={handleSubmit}
                      loading={isLoadingBilling}
                      className={button}
                      style={{
                        backgroundImage:
                          "linear-gradient(to right,#ef3d4e,#ae2865)",
                      }}
                    >
                      Ok
                    </Button>
                  </div>
                </Modal>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </Modal>
  )
}
