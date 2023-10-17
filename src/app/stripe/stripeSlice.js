import { createSlice } from "@reduxjs/toolkit"

export const stripeSlice = createSlice({
  name: "stripe",
  initialState: {
    customerData: {
      first_name: "",
      last_name: "",
      // full_name: "",
      phone: "",
      email: "",
      password: "",
      country: "",
      city: "",
      ip: "",
      customer_id: "",
      checkout_session_id: "",
    },
    paymentsDetails: {
      card_holder: "",
      card_number: "",
      company_name: "",
      country: "",
      cvc: "",
      month: "",
      url_cpanel: "",
      registration_key: "",
      membership_id: "",
      initial_price: "",
      monthly_price: "",
      plan_code: "",
    },
  },
  reducers: {
    setCustomerData: (state, action) => {
      state.customerData = action.payload
    },
    setPaymentsDetails: (state, action) => {
      state.paymentsDetails = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setCustomerData, setPaymentsDetails } = stripeSlice.actions
