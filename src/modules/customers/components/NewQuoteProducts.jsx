import { Button, Descriptions, Divider, Typography } from 'antd'
import { ErrorMessage, Field, FieldArray, useFormikContext } from 'formik'
import { useState } from 'react'
import { ProductItem } from '.'

export const NewQuoteProducts = ({ monthlyProgram, setupFeeProgram }) => {
  const { values } = useFormikContext()
  const totalMonthly =
    parseFloat(monthlyProgram) +
    parseFloat(
      values.products
        .map(({ currencies }) => currencies?.unit_amount || 0)
        .reduce((a, b) => a + b, 0),
    )
  const totalSetup =
    parseFloat(setupFeeProgram) +
    parseFloat(
      values.products
        .map(({ currencies }) => currencies?.setup_fee || 0)
        .reduce((a, b) => a + b, 0),
    )

  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      <Typography.Title level={4}>Products</Typography.Title>
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
                >
                  Add Product
                </Button>
              </div>
            </div>
          )}
        </FieldArray>
      </div>

      <Descriptions bordered style={{ marginTop: '32px' }}>
        <Descriptions.Item label='Total Monthly'>{`$${totalMonthly}`}</Descriptions.Item>
        <Descriptions.Item label='Total SetUp Free'>{`$${totalSetup}`}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}
