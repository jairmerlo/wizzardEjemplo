import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom'
import App from '../App'
import { ErrorHandler } from '../components'
import customersRouter from '../modules/customers/router'
import membershipsRouter from '../modules/memberships/router'

const { VITE_APP_COMPONENT } = import.meta.env

const router = (() => {
  switch (VITE_APP_COMPONENT) {
    case 'customers':
      return customersRouter
    case 'memberships':
      return membershipsRouter
    default:
      return createHashRouter(
        createRoutesFromElements(
          <Route path='/' element={<App />}>
            <Route
              index
              element={
                <ErrorHandler description='You have not imported any components.' />
              }
            />
            <Route path='*' element={<Navigate to='/' replace={true} />} />
          </Route>,
        ),
      )
  }
})()

export default router
