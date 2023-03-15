import { Tabs } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { MembershipsTable, MembershipsTableTrial } from './components'

const Memberships = () => {
  const { filter } = useParams()
  const navigate = useNavigate()
  const onChange = key => {
    navigate(`/${key}`)
  }

  return (
    <Tabs
      activeKey={filter}
      onChange={onChange}
      size='large'
      type='card'
      items={[
        {
          label: `Active`,
          key: 'active',
          children: filter === 'active' && <MembershipsTable />,
          forceRender: true,
        },
        {
          label: `Access`,
          key: 'access',
          children: filter === 'access' && <MembershipsTable filter='access' />,
          forceRender: true,
        },
        {
          label: `IDX`,
          key: 'idx',
          children: filter === 'idx' && <MembershipsTable filter='idx' />,
          forceRender: true,
        },
        {
          label: `Premium`,
          key: 'premium',
          children: filter === 'premium' && (
            <MembershipsTable filter='premium' />
          ),
          forceRender: true,
        },
        {
          label: `Generate`,
          key: 'generate',
          children: filter === 'generate' && (
            <MembershipsTable filter='generate' />
          ),
          forceRender: true,
        },
        {
          label: `Dominate`,
          key: 'dominate',
          children: filter === 'dominate' && (
            <MembershipsTable filter='dominate' />
          ),
          forceRender: true,
        },
        {
          label: `Onnmipresence`,
          key: 'omnipresence',
          children: filter === 'omnipresence' && (
            <MembershipsTable filter='onnmipresence ' />
          ),
          forceRender: true,
        },
        {
          label: `Custom`,
          key: 'custom',
          children: filter === 'custom' && <MembershipsTable filter='custom' />,
          forceRender: true,
        },
        {
          label: `Trial`,
          key: 'trial',
          children: filter === 'trial' && <MembershipsTableTrial />,
          forceRender: true,
        },
        {
          label: `IDX Requested`,
          key: 'idx_requested',
          children: filter === 'idx_requested' && (
            <MembershipsTable filter='idx_requested' />
          ),
          forceRender: true,
        },
        {
          label: `Pending`,
          key: 'pending',
          children: filter === 'pending' && (
            <MembershipsTable filter='pending' />
          ),
          forceRender: true,
        },
        {
          label: `Cancelled`,
          key: 'cancelled',
          children: filter === 'cancelled' && (
            <MembershipsTable filter='cancelled' />
          ),
          forceRender: true,
        },
        {
          label: `Launch Website`,
          key: 'launch_website',
          children: filter === 'launch_website' && (
            <MembershipsTable filter='launch_website' />
          ),
          forceRender: true,
        },
      ]}
    />
  )
}

export default Memberships
