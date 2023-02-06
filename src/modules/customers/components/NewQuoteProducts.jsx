import { Button, Descriptions, Divider, Typography } from 'antd'
import { useFormikContext } from 'formik'
import { ProductItem } from '.'

export const NewQuoteProducts = () => {
  const { values } = useFormikContext()
  return (
    <div style={{ marginTop: '32px', marginBottom: '32px' }}>
      <Typography.Title level={4}>Products</Typography.Title>
      <Divider dashed />
      <div>
        {values.products.map(item => (
          <li>{item.product_category}</li>
        ))}
      </div>
      <div>
        <ProductItem />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          paddingTop: '16px',
        }}
      >
        <Button>Add Product</Button>
      </div>
      <Descriptions bordered style={{ marginTop: '32px' }}>
        <Descriptions.Item label='Total Monthly'>{`$0`}</Descriptions.Item>
        <Descriptions.Item label='Total SetUp Free'>{`$0`}</Descriptions.Item>
      </Descriptions>
    </div>
  )
}
