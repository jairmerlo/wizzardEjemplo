import {
  createHashRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom'
import App from '../../../App'
import Memberships from '..'

const membershipsRouter = createHashRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index element={<Navigate to='active' replace={true} />} />
      <Route path=':filter' element={<Memberships />} />
      <Route path='*' element={<Navigate to='/' replace={true} />} />
    </Route>,
  ),
)

export default membershipsRouter
