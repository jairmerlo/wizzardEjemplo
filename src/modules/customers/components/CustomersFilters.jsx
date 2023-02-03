import { Tabs } from 'antd'
import { useState } from 'react'
import { CustomersTableV1 } from '.'

export const CustomersFilters = () => {
  const [tableKey, setTableKey] = useState('1')
  const onChange = key => {
    setTableKey(key)
  }

  return (
    <Tabs
      defaultActiveKey='1'
      onChange={onChange}
      size='large'
      type='card'
      items={[
        {
          label: `Active`,
          key: '1',
          children: tableKey === '1' && <CustomersTableV1 />,
          forceRender: true,
        },
        {
          label: `Access`,
          key: '2',
          children: tableKey === '2' && <CustomersTableV1 filter='access' />,
          forceRender: true,
        },
        {
          label: `IDX`,
          key: '3',
          children: tableKey === '3' && <CustomersTableV1 filter='idx' />,
          forceRender: true,
        },
        {
          label: `Premium`,
          key: '4',
          children: tableKey === '4' && <CustomersTableV1 filter='premium' />,
          forceRender: true,
        },
        {
          label: `Generate`,
          key: '5',
          children: tableKey === '5' && <CustomersTableV1 filter='generate' />,
          forceRender: true,
        },
        {
          label: `Dominate`,
          key: '6',
          children: tableKey === '6' && <CustomersTableV1 filter='dominate' />,
          forceRender: true,
        },
        {
          label: `Pending`,
          key: '7',
          children: tableKey === '7' && <CustomersTableV1 filter='pending' />,
          forceRender: true,
        },
        {
          label: `Cancelled`,
          key: '8',
          children: tableKey === '8' && <CustomersTableV1 filter='cancelled' />,
          forceRender: true,
        },
        {
          label: `Omnipresence`,
          key: '9',
          children: tableKey === '9' && (
            <CustomersTableV1 filter='omnipresence' />
          ),
          forceRender: true,
        },
        {
          label: `Custom`,
          key: '10',
          children: tableKey === '10' && <CustomersTableV1 filter='custom' />,
          forceRender: true,
        },
      ]}
    />
  )
}
