import { Descriptions } from 'antd'
import { useFormikContext } from 'formik'
import React, { useEffect, useState } from 'react'
import { applyCouponToProgram } from '../helpers'
import { NewQuoteProducts } from './NewQuoteProducts'

export const NewQuoteDescription = ({ programs = [] }) => {
  const { values } = useFormikContext()
  // const [couponToProgram, setCouponToProgram] = useState({
  //   total_amount: 0,
  //   total_setup: 0,
  // })
  // const monthlyProgram =
  //   values.coupon && values.program
  //     ? couponToProgram.total_amount
  //     : programs.find(item => item.value === values.program)?.total_amount || 0
  // const setupFeeProgram =
  //   couponToProgram.total_setup ||
  //   programs.find(item => item.value === values.program)?.total_setup || 0

  const currencyFormatter = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: "USD"
    })
    return formatter.format(value)
  }

  let monthlyProgram =
    values.program
      ? parseFloat(programs.find(item => item.value === values.program)?.total_amount) || 0
      : 0
  let setupFeeProgram =
    values.program
      ? parseFloat(programs.find(item => item.value === values.program)?.total_setup) || 0
      : 0


  // useEffect(() => {
  //   values.coupon &&
  //     values.program &&
  //     applyCouponToProgram({
  //       coupon_name: values.coupon,
  //       program_id: values.program,
  //     }).then(data => setCouponToProgram(data))
  // }, [values.coupon, values.program])
  return (
    <>
      <Descriptions bordered style={{ marginTop: '32px', backgroundColor: '#ace5a0', borderRadius: '10px' }}>
        <Descriptions.Item label='Monthly Program' style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)' }}>
          {`${currencyFormatter(monthlyProgram)}`}
        </Descriptions.Item>
        <Descriptions.Item label='Setup Free Program' style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)' }}>
          {`${currencyFormatter(setupFeeProgram)}`}
        </Descriptions.Item>
      </Descriptions>
      <NewQuoteProducts
        monthlyProgram={monthlyProgram}
        setupFeeProgram={setupFeeProgram}
      />
    </>
  )
}
