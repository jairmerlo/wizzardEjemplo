import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom'
import Customers from '..'
import App from '../../../App'
import { CustomerView, NewQuote } from '../components'

//* In lazy load mode
// const Customers = lazy(() => import(/* webpackChunkName: "customers" */ '..'))

const customersRouter = createHashRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Customers />} />
      <Route path='customer-view/:customerId' element={<CustomerView />} />
      <Route path='new-quote' element={<NewQuote />} />
      <Route path='*' element={<Navigate to='/' replace={true} />} />
    </Route>,
  ),
)

export default customersRouter
