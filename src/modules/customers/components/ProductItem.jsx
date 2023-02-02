import { DeleteOutlined } from '@ant-design/icons'
import { Button, Form, Input, Select } from 'antd'
import { useCss } from 'react-use'
import { useGetProductOptionsQuery } from '../../../app/api/billing'

export const ProductItem = ({ company = 'standard' }) => {
  const { data = {} } = useGetProductOptionsQuery({
    company,
  })
  const { categories = [], groups = [], products = [] } = data
  console.log({ data })
  const formItemSelect = useCss({
    flexGrow: 2,
  })

  const formItemInput = useCss({
    flexGrow: 1,
    flexBasis: '32px',
  })
  return (
    <div
      style={{
        padding: '16px 24px',
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
        borderRadius: '8px',
        border: '1px solid rgba(5, 5, 5, 0.06)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button shape='circle' icon={<DeleteOutlined />} />
      </div>
      <Form
        layout='vertical'
        autoComplete='off'
        style={{ display: 'flex', gap: '16px', position: 'relative' }}
      >
        <Form.Item label='Product' className={formItemSelect}>
          <Select placeholder='Product' options={[]} />
        </Form.Item>
        <Form.Item label='Monthly' className={formItemInput}>
          <Input />
        </Form.Item>
        <Form.Item label='SetUp Fee' className={formItemInput}>
          <Input />
        </Form.Item>
        <Form.Item label='Category' className={formItemSelect}>
          <Select placeholder='Category' options={[]} />
        </Form.Item>
        <Form.Item label='Group' className={formItemSelect}>
          <Select placeholder='Group' options={[]} />
        </Form.Item>
      </Form>
    </div>
  )
}
