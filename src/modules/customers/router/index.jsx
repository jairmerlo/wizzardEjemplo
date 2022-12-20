import { lazy } from 'react'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom'
import App from '../../../App'
import { CustomerView } from '../components'

const Customers = lazy(() => import(/* webpackChunkName: "customers" */ '..'))

const customersRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Customers />} />
      <Route path='customer-view/:customerId' element={<CustomerView />} />
      <Route path='*' element={<Navigate to='/' replace={true} />} />
    </Route>,
  ),
)

export default customersRouter
