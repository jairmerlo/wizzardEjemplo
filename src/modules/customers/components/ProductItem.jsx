import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import { Select, Input } from 'formik-antd'
import { ErrorMessage, useFormikContext } from 'formik'
import { useCss } from 'react-use'
import { useGetProductOptionsQuery } from '../../../app/api/billing'

const productsData = [
  {
    plan_id: '1029', //* program seleccionado
    item_id: '1462', //* id del product
    currencies: { currency: 'USD', setup_fee: 999, unit_amount: 299 },
    category: '23', //* id de group
    product_category: 'Website Services', //* name de category
    item_sort: 0, //* order en el que se va asociando los productos, el primero es 0, el segundo es 1
  },
  {
    plan_id: '1029',
    item_id: '1457',
    currencies: { currency: 'USD', setup_fee: 0, unit_amount: 99 },
    category: '12',
    product_category: 'Website Services',
    item_sort: 1,
  },
]

export const ProductItem = ({ onRemove, productIndex }) => {
  const { values, errors, touched } = useFormikContext()
  // console.log({ errors })
  // console.log({ values })
  const { data = {} } = useGetProductOptionsQuery(
    {
      company: values.brokerage,
      program_id: values.program,
    },
    {
      skip: !values.brokerage,
    },
  )
  const { categories = [], groups = [], products = [] } = data
  // console.log({ data })
  const formItemSelect = useCss({
    flexGrow: 2,
  })

  const formItemInput = useCss({
    flexGrow: 1,
    flexBasis: '32px',
  })
  return (
    <div>
      <div
        style={{
          padding: '16px 24px',
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
          borderRadius: '8px',
          border: '1px solid rgba(5, 5, 5, 0.06)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onRemove} shape='circle' icon={<DeleteOutlined />} />
        </div>
        <Form
          layout='vertical'
          autoComplete='off'
          style={{ display: 'flex', gap: '16px', position: 'relative' }}
        >
          <Form.Item
            label='Product'
            className={formItemSelect}
            required
            validateStatus={
              errors.products &&
              errors.products[productIndex]?.item_id &&
              touched.products &&
              touched.products?.[productIndex]?.item_id &&
              'error'
            }
            help={<ErrorMessage name={`products[${productIndex}].item_id`} />}
          >
            <Select
              placeholder='Product'
              options={products}
              name={`products[${productIndex}].item_id`}
            />
          </Form.Item>
          <Form.Item
            label='Monthly'
            className={formItemInput}
            required
            validateStatus={
              errors.products &&
              errors.products[productIndex]?.currencies?.unit_amount &&
              touched.products &&
              touched.products?.[productIndex]?.currencies?.unit_amount &&
              'error'
            }
            help={
              <ErrorMessage
                name={`products[${productIndex}].currencies.unit_amount`}
              />
            }
          >
            <Input
              name={`products[${productIndex}].currencies.unit_amount`}
              type='number'
            />
          </Form.Item>
          <Form.Item
            label='SetUp Fee'
            className={formItemInput}
            required
            validateStatus={
              errors.products &&
              errors.products[productIndex]?.currencies?.setup_fee &&
              touched.products &&
              touched.products?.[productIndex]?.currencies?.setup_fee &&
              'error'
            }
            help={
              <ErrorMessage
                name={`products[${productIndex}].currencies.setup_fee`}
              />
            }
          >
            <Input
              name={`products[${productIndex}].currencies.setup_fee`}
              type='number'
            />
          </Form.Item>
          <Form.Item
            label='Category'
            className={formItemSelect}
            required
            validateStatus={
              errors.products &&
              errors.products[productIndex]?.product_category &&
              touched.products &&
              touched.products?.[productIndex]?.product_category &&
              'error'
            }
            help={
              <ErrorMessage
                name={`products[${productIndex}].product_category`}
              />
            }
          >
            <Select
              placeholder='Category'
              options={categories}
              name={`products[${productIndex}].product_category`}
            />
          </Form.Item>
          {/* <Form.Item label='Group' className={formItemSelect}>
            <Select placeholder='Group' options={groups} />
          </Form.Item> */}
        </Form>
      </div>
    </div>
  )
}
