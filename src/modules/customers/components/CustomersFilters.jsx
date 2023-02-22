import { Tabs } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { CustomersTableV1 } from '.'

export const CustomersFilters = () => {
  const navigate = useNavigate()
  const { filter } = useParams()
  const onChange = key => {
    navigate(`/${key}`)
  }

  return (
    <Tabs
      onChange={onChange}
      activeKey={filter}
      size='large'
      type='card'
      items={[
        {
          label: `Active`,
          key: 'active',
          children: filter === 'active' && <CustomersTableV1 />,
          forceRender: true,
        },
        {
          label: `Access`,
          key: 'access',
          children: filter === 'access' && <CustomersTableV1 filter='access' />,
          forceRender: true,
        },
        {
          label: `IDX`,
          key: 'idx',
          children: filter === 'idx' && <CustomersTableV1 filter='idx' />,
          forceRender: true,
        },
        {
          label: `Premium`,
          key: 'premium',
          children: filter === 'premium' && (
            <CustomersTableV1 filter='premium' />
          ),
          forceRender: true,
        },
        {
          label: `Generate`,
          key: 'generate',
          children: filter === 'generate' && (
            <CustomersTableV1 filter='generate' />
          ),
          forceRender: true,
        },
        {
          label: `Dominate`,
          key: 'dominate',
          children: filter === 'dominate' && (
            <CustomersTableV1 filter='dominate' />
          ),
          forceRender: true,
        },
        {
          label: `Pending`,
          key: 'pending',
          children: filter === 'pending' && (
            <CustomersTableV1 filter='pending' />
          ),
          forceRender: true,
        },
        {
          label: `Cancelled`,
          key: 'cancelled',
          children: filter === 'cancelled' && (
            <CustomersTableV1 filter='cancelled' />
          ),
          forceRender: true,
        },
        {
          label: `Omnipresence`,
          key: 'omnipresence',
          children: filter === 'omnipresence' && (
            <CustomersTableV1 filter='omnipresence' />
          ),
          forceRender: true,
        },
        {
          label: `Custom`,
          key: 'custom',
          children: filter === 'custom' && <CustomersTableV1 filter='custom' />,
          forceRender: true,
        },
      ]}
    />
  )
}
