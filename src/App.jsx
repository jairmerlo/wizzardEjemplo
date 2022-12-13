import { lazy, Suspense } from 'react'
import { ErrorHandler, Fallback } from './components'

const { VITE_APP_COMPONENT } = import.meta.env

const LazyCustomers = lazy(() =>
  import(/* webpackChunkName: "Customers" */ './modules/customers'),
)

const Component = () => {
  switch (VITE_APP_COMPONENT) {
    case 'customers':
      return <LazyCustomers />

    default:
      return <ErrorHandler />
  }
}

const App = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Component />
    </Suspense>
  )
}
export default App
