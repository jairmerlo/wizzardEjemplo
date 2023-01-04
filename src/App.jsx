import { Provider } from 'react-redux'
import store from './app/store'
import { Outlet } from 'react-router-dom'

const App = () => {
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  )
}
export default App
