import { lazy, Suspense } from 'react'
import { Provider } from 'react-redux'
import { ErrorHandler, Fallback } from './components'
import store from './app/store'

const { VITE_APP_COMPONENT } = import.meta.env

const LazyCustomers = lazy(() =>
  import(/* webpackChunkName: "Customers" */ './modules/customers'),
)

const Component = () => {
  switch (VITE_APP_COMPONENT) {
    case 'customers':
      return <LazyCustomers />

    default:
      return (
        <ErrorHandler description='You have not imported any components.' />
      )
  }
}

const App = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={<Fallback />}>
        <Component />
      </Suspense>
    </Provider>
  )
}
export default App
