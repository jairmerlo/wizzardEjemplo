import { Provider } from "react-redux"
import store from "./app/store"
import { Outlet } from "react-router-dom"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const { VITE_APP_COMPONENT } = import.meta.env
const stripePromise = loadStripe(
  "pk_test_51MPGWNBfWCdjsfM6pEtRKAswmtVRy62ZXAzI9oFW0E40LUwIb7zp6sk1465KtOEgjwXVXUQ9D5lVhnmJlU88Uvbi008HFVFEhn"
)
const App = () => {
  // console.log({ VITE_APP_COMPONENT })
  return (
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <Outlet />
      </Elements>
    </Provider>
  )
}
export default App
