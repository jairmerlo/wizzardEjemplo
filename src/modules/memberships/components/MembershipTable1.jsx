import { Divider, Typography } from "antd"
import {
  IDXCard,
  IDXCardContent,
  YourProductItem,
} from "../../customers/components"
import { useSelector } from "react-redux"
import { useGetThirdStepInformationQuery } from "../../../app/api/billing"

export const MembershipTable1 = () => {
  const { customerData, paymentsDetails } = useSelector((state) => state.stripe)
  const { data = {} } = useGetThirdStepInformationQuery({
    registration_key: paymentsDetails.registration_key,
    program_code: paymentsDetails.plan_code,
  })
  console.log({ data })

  return (
    <IDXCard style={{ width: "500px" }}>
      <IDXCardContent
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography.Title level={3}>
          Membership Creation Success!
        </Typography.Title>
        {customerData.full_name}
        {customerData.email}
        {customerData.phone}
        <Typography.Title level={3}>Billing Information</Typography.Title>
        Qwe Stripe - Boost04001
        <Typography.Title level={3}>Payment Information</Typography.Title>
        <YourProductItem
          label="First payment (After Trial Ends)"
          text="$99.00"
        />
        <Divider style={{ margin: "15px 0" }} />
        <YourProductItem label="Monthly Fee" text="$99.00" />
        <Divider style={{ margin: "15px 0" }} />
        <YourProductItem label="Billing Frequency" text="$Monthly" />
        <Divider style={{ margin: "15px 0" }} />
        <YourProductItem label="Initial Term" text="Sep 19, 2023" />
        <Divider style={{ margin: "15px 0" }} />
        <div
          style={{
            width: "100%",
            padding: "15px 20px",
            backgroundColor: "#8bd237",
            // backgroundColor: theme.colors.green,
          }}
        >
          <YourProductItem label="Total Initial Payment" text="$0.00" />
        </div>
        <Divider style={{ margin: "15px 0" }} />
        <YourProductItem label="Monthly Dues (After 30 Days)" text="$99.00" />
        <Typography.Text level={3}>
          Your card will be billed on Sep 19,2023
        </Typography.Text>
      </IDXCardContent>
    </IDXCard>
  )
}
