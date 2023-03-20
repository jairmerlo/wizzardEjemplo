import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom'
import Customers from '..'
import App from '../../../App'
import {
  CustomerEdit,
  CustomerView,
  CustomerViewChild,
  Document,
  MembershipDetails,
  NewQuote,
} from '../components'

//* In lazy load mode
// const Customers = lazy(() => import(/* webpackChunkName: "customers" */ '..'))

const customersRouter = createHashRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Navigate to='active' replace={true} />} />
      <Route path=':filter' element={<Customers />} />
      <Route path='customer-view/:customerId' element={<CustomerView />}>
        <Route index element={<CustomerViewChild />} />
      </Route>
      <Route path='customer-edit/:customerId' element={<CustomerEdit />} />
      <Route
        path='membership-details/:membershipRegKey'
        element={<CustomerView />}
      >
        <Route index element={<MembershipDetails />} />
      </Route>
      {/* <Route
        path=':customerId/:formType/:membershipId'
        element={<Document />}
      /> */}
      <Route path='new-quote' element={<NewQuote />} />
      <Route path='*' element={<Navigate to='/' replace={true} />} />
    </Route>,
  ),
)

export default customersRouter
