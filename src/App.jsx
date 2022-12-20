import { Suspense } from 'react'
import { Provider } from 'react-redux'
import { Fallback } from './components'
import store from './app/store'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <Provider store={store}>
      <Suspense fallback={<Fallback />}>
        <Outlet />
      </Suspense>
    </Provider>
  )
}
export default App
