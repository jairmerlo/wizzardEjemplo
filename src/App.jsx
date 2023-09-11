import { Provider } from "react-redux"
import store from "./app/store"
import { Outlet } from "react-router-dom"

const { VITE_APP_COMPONENT } = import.meta.env
const App = () => {
  // console.log({ VITE_APP_COMPONENT })
  return (
    <Provider store={store}>
      <Outlet />
    </Provider>
  )
}
export default App
