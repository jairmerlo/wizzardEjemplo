import { Tabs } from 'antd'
import { CustomersTableV1 } from '.'

export const CustomersFilters = () => {
  const onChange = key => {
    console.log(key)
  }

  return (
    <Tabs
      defaultActiveKey='1'
      onChange={onChange}
      size='large'
      type='card'
      items={[
        {
          label: `All`,
          key: '1',
          children: <CustomersTableV1 />,
          forceRender: true,
        },
        {
          label: `Access`,
          key: '2',
          children: `Content of Tab Pane 2`,
          forceRender: true,
        },
        {
          label: `IDX`,
          key: '3',
          children: `Content of Tab Pane 3`,
          forceRender: true,
        },
        {
          label: `Premium`,
          key: '4',
          children: `Content of Tab Pane 4`,
          forceRender: true,
        },
        {
          label: `Generate`,
          key: '5',
          children: `Content of Tab Pane 5`,
          forceRender: true,
        },
        {
          label: `Dominate`,
          key: '6',
          children: `Content of Tab Pane 6`,
          forceRender: true,
        },
        {
          label: `Pending`,
          key: '7',
          children: `Content of Tab Pane 7`,
          forceRender: true,
        },
        {
          label: `Cancelled`,
          key: '8',
          children: `Content of Tab Pane 8`,
          forceRender: true,
        },
      ]}
    />
  )
}
