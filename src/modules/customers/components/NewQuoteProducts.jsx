import { Button, Descriptions, Divider, Typography } from 'antd'
import { ErrorMessage, Field, FieldArray, useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import { ProductItem } from '.'
import { useCss } from 'react-use'
import { applyCouponToProgram } from '../helpers'

export const NewQuoteProducts = ({ monthlyProgram, setupFeeProgram }) => {

  const currencyFormatter = (value) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      minimumFractionDigits: 2,
      currency: 'USD'
    })
    return formatter.format(value)
  }
  const { values, setFieldValue } = useFormikContext()
  // console.log({ values })
  const [couponToProgram, setCouponToProgram] = useState({
    total_amount: 0,
    total_setup: 0,
  })
  let totalMonthly =
    values.coupon && values.program
      ? couponToProgram.total_amount +
      parseFloat(
        values.products
          .map(({ currencies }) => currencies?.unit_amount || 0)
          .reduce((a, b) => a + b, 0),
      )
      : parseFloat(monthlyProgram) +
      parseFloat(
        values.products
          .map(({ currencies }) => currencies?.unit_amount || 0)
          .reduce((a, b) => a + b, 0),
      )
  let totalSetup =
    values.coupon && values.program
      ? couponToProgram.total_setup +
      parseFloat(
        values.products
          .map(({ currencies }) => currencies?.setup_fee || 0)
          .reduce((a, b) => a + b, 0),
      )
      : parseFloat(setupFeeProgram) +
      parseFloat(
        values.products
          .map(({ currencies }) => currencies?.setup_fee || 0)
          .reduce((a, b) => a + b, 0),
      )

  const button = useCss({
    // color: 'white',
    fontWeight: '600',
    padding: '12px 30px',
    marginLeft: '10px',
    // padding: '7px 20px',
    fontSize: '14px',
    border: '1px solid #e4e4e4',
    borderRadius: '25px',
    minHeight: '50px'
  })

  useEffect(() => {
    values.coupon &&
      values.program &&
      applyCouponToProgram({
        coupon_name: values.coupon,
        program_id: values.program,
      }).then(data => setCouponToProgram(data))
  }, [values.coupon, values.program])

  useEffect(() => {
    setFieldValue('totalAmount', totalMonthly)
    setFieldValue('totalSetup', totalSetup)
  }, [values.coupon, values.program])

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      <Typography.Title level={4} style={{ fontWeight: 'bold' }}>Products</Typography.Title>
      <Divider dashed />
      <div>
        <FieldArray name='products'>
          {({ insert, remove, push }) => (
            <div>
              {values.products.length > 0 &&
                values.products.map((product, index) => (
                  <ProductItem
                    onRemove={() => remove(index)}
                    productIndex={index}
                    key={index}
                  />
                ))}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  paddingTop: '16px',
                }}
              >
                <Button
                  disabled={!values.brokerage || !values.program}
                  onClick={() =>
                    push({
                      plan_id: values.program,
                      item_id: '',
                      currencies: {
                        currency: 'USD',
                        setup_fee: '',
                        unit_amount: '',
                      },
                      category: '',
                      product_category: '',
                      item_sort: 0,
                    })
                  }
                  className={button}
                >
                  Add Product
                </Button>
              </div>
            </div>
          )}
        </FieldArray>
      </div>

      <Descriptions bordered style={{ marginTop: '32px', backgroundColor: '#ace5a0', borderRadius: '10px' }}>
        <Descriptions.Item label='Total Monthly' style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)' }}>
          {`${currencyFormatter(totalMonthly)}`}</Descriptions.Item>
        <Descriptions.Item label='Total SetUp Free' style={{ border: 'none', backgroundColor: 'rgba(0,0,0,0)' }}>
          {`${currencyFormatter(totalSetup)}`}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}
