import { configureStore } from '@reduxjs/toolkit'
import billing from './api/billing'

const store = configureStore({
  reducer: {
    // ui: uiReducer,
    [billing.reducerPath]: billing.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(billing.middleware),
  // .concat(logger) //* redux-logger
  devTools: process.env.NODE_ENV !== 'production',
})

export default store
