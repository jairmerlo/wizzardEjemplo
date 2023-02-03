import { Tabs } from 'antd'
import { useState } from 'react'
import { MembershipsTable, MembershipsTableTrial } from './components'

const Memberships = () => {
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
          children: tableKey === '1' && <MembershipsTable />,
          forceRender: true,
        },
        {
          label: `Access`,
          key: '2',
          children: tableKey === '2' && <MembershipsTable filter='access' />,
          forceRender: true,
        },
        {
          label: `IDX`,
          key: '3',
          children: tableKey === '3' && <MembershipsTable filter='idx' />,
          forceRender: true,
        },
        {
          label: `Premium`,
          key: '4',
          children: tableKey === '4' && <MembershipsTable filter='premium' />,
          forceRender: true,
        },
        {
          label: `Generate`,
          key: '5',
          children: tableKey === '5' && <MembershipsTable filter='generate' />,
          forceRender: true,
        },
        {
          label: `Dominate`,
          key: '6',
          children: tableKey === '6' && <MembershipsTable filter='dominate' />,
          forceRender: true,
        },
        {
          label: `Pending`,
          key: '7',
          children: tableKey === '7' && <MembershipsTable filter='pending' />,
          forceRender: true,
        },
        {
          label: `Cancelled`,
          key: '8',
          children: tableKey === '8' && <MembershipsTable filter='cancelled' />,
          forceRender: true,
        },
        {
          label: `Trial`,
          key: '9',
          children: tableKey === '9' && <MembershipsTableTrial />,
          forceRender: true,
        },
      ]}
    />
  )
}

export default Memberships
