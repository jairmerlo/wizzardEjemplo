import { CustomersFilters } from './components'

const Customers = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      <CustomersFilters />
    </div>
  )
}

export default Customers
