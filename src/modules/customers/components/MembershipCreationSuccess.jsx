import { Divider, Typography } from 'antd'
import { IDXCard, IDXCardContent, YourProductItem } from '.'
// import theme from '../../../theme'

export const MembershipCreationSuccess = ({
  name = '',
  email = '',
  phone = '',
  setupFee = '',
  monthlyFee = '',
  billingFrecuency = '',
  initialTerm = '',
  paymentMethod = '',
  paymentMethodValue = '',
  creditCardFee = '',
  processingSetupFee = '',
  processingMonthlyFee = '',
  totalInitialPayment = '',
  monthlyDues = '',
  addOns = [],
  couponId,
  couponName = '',
  setupfeeAmount = 0,
  monthlyfeeAmount = 0,
  couponTypeSetupfee = 'Fixed',
}) => {
  let method = ''
  if (paymentMethod === 'ach') {
    method = 'ACH :'
  } else {
    method = 'Card :'
  }

  const sign = couponTypeSetupfee === 'Fixed' ? '$' : '%'

  return (
    <IDXCard style={{ width: '400px', height: 'fit-content' }}>
      <IDXCardContent>
        <Typography.Title level={3} style={{ textAlign: 'left' }}>
          Membership Creation Success!
        </Typography.Title>
        <Typography.Text>
          {name}
          <br />
          {email}
          <br />
          {phone}
        </Typography.Text>
        <Typography.Title
          level={4}
          style={{ textAlign: 'left', marginTop: 10 }}
        >
          Billing Information
        </Typography.Title>
        <Typography.Text>
          {name}
          <br />
        </Typography.Text>
        <YourProductItem
          label={method}
          text={paymentMethodValue}
        />
        {/* Card: **********1111 */}
        <Typography.Title
          level={4}
          style={{ textAlign: 'left', marginTop: 10 }}
        >
          Payment Information
        </Typography.Title>
        <YourProductItem
          label="Setup Fee ( One Time )"
          text={setupFee}
        />
        <Divider style={{ margin: '15px 0' }} />
        <YourProductItem
          label='Monthly Fee'
          text={monthlyFee}
        />
        <Divider style={{ margin: '15px 0' }} />
        <YourProductItem label='Billing Frequency' text={billingFrecuency} />
        <Divider style={{ margin: '15px 0' }} />
        <YourProductItem label='Purchased Date' text={initialTerm} />
        {(paymentMethod === 'card') && (creditCardFee !== null) && (
          <>
            <Divider style={{ margin: '20px 0' }} />
            <Typography.Title level={4} style={{ textAlign: 'left' }}>
              Processing Fee
            </Typography.Title>
            <YourProductItem
              label='4% Processing Setup Fee'
              text={processingSetupFee}
            />
            <Divider style={{ margin: '15px 0' }} />
            <YourProductItem
              label='4% Processing Monthly Fee'
              text={processingMonthlyFee}
            />
          </>
        )}
        {(addOns.length !== 0) && (
          <>
            <Divider style={{ margin: '20px 0' }} />
            <Typography.Title level={4} style={{ textAlign: 'left' }}>
              Add Ons
            </Typography.Title>
          </>
        )}

        {
          addOns.map(addOn => (
            <>
              <YourProductItem
                label={addOn.name}
                text={addOn.amount}
              />
              <Divider style={{ margin: '10px 0' }} />
            </>

          ))
        }
        <Divider style={{ margin: '20px 0' }} />

      </IDXCardContent>
      <div
        style={{
          width: '100%',
          padding: '15px 20px',
          backgroundColor: '#8bd237'
          // backgroundColor: theme.colors.green,
        }}
      >
        <YourProductItem label='Payment' text={totalInitialPayment} />
      </div>
      <div
        style={{
          width: '100%',
          padding: '15px 20px',
        }}
      >
        <YourProductItem
          label='Next Monthly Billing Amount'
          text={monthlyDues}
        />
      </div>
      {(couponId !== null) && (
        <IDXCardContent>
          <Divider style={{ margin: '5px' }} />
          <Typography.Title level={4} style={{ textAlign: 'left' }}>
            Coupon Information
          </Typography.Title>
          <Divider dashed style={{ margin: '5px' }} />
          <YourProductItem
            label='Coupon Name:'
            text={couponName}
          />
          <YourProductItem
            label='Setup Fee'
            text={`${sign} ${setupfeeAmount} ( Discount)`}
          />
          <YourProductItem
            label='Monthly Fee'
            text={`${sign} ${monthlyfeeAmount} ( Discount)`}
          />
        </IDXCardContent>
      )}
    </IDXCard>
  )
}
