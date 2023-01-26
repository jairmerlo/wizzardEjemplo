import { Descriptions } from 'antd'
import { useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import { applyCouponToProgram } from '../helpers'

export const NewQuoteDescription = ({ programs = [] }) => {
  const { values } = useFormikContext()
  const [couponToProgram, setCouponToProgram] = useState({
    total_amount: 0,
    total_setup: 0,
  })
  console.log({ values })
  useEffect(() => {
    values.coupon &&
      values.program &&
      applyCouponToProgram({
        coupon_name: values.coupon,
        program_id: values.program,
      }).then(data => setCouponToProgram(data))
  }, [values.coupon, values.program])
  return (
    <Descriptions bordered style={{ marginTop: '32px' }}>
      <Descriptions.Item label='Monthly Program'>
        {`$${
          values.coupon && values.program
            ? couponToProgram.total_amount
            : programs.find(item => item.value === values.program)
                ?.total_amount || 0
        }`}
      </Descriptions.Item>
      <Descriptions.Item label='Setup Free Program'>
        {`$${
          couponToProgram.total_setup ||
          programs.find(item => item.value === values.program)?.total_setup ||
          0
        }`}
      </Descriptions.Item>
    </Descriptions>
  )
}
