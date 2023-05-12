import { API } from '../../../api'

export const applyCouponToProgram = async ({ coupon_name, program_id }) => {
  const data = await fetch(`${API._BILLING_HOST}/apply-coupon-to-program`, {
    method: 'POST',
    body: JSON.stringify({
      coupon_name,
      program_id,
    }),
  }).then(res => res.json())
  // console.log({ data })
  return data
}
