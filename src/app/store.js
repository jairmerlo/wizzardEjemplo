import { configureStore } from "@reduxjs/toolkit"
import backoffice from "./api/backoffice"
import billing from "./api/billing"
import { stripeSlice } from "./stripe/stripeSlice"

const store = configureStore({
  reducer: {
    // ui: uiReducer,
    stripe: stripeSlice.reducer,
    [billing.reducerPath]: billing.reducer,
    [backoffice.reducerPath]: backoffice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(billing.middleware)
      .concat(backoffice.middleware),
  // .concat(logger) //* redux-logger
  devTools: process.env.NODE_ENV !== "production",
})

export default store
