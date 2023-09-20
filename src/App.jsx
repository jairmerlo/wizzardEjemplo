import { Provider } from "react-redux"
import store from "./app/store"
import { Outlet } from "react-router-dom"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

const { VITE_APP_COMPONENT, VITE_PUBLIC_KEY } = import.meta.env
const stripePromise = loadStripe(VITE_PUBLIC_KEY)
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
