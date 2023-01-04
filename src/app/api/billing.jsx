import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const {
  VITE_APP_API_BILLING_HOST,
  VITE_APP_API_PACKAGE_BUILDER,
  VITE_APP_API_BACKOFFICE,
} = import.meta.env

export const billing = createApi({
  reducerPath: 'billing',
  baseQuery: fetchBaseQuery({
    baseUrl: VITE_APP_API_BILLING_HOST,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  endpoints: builder => ({
    getCustomers: builder.query({
      query: ({ page, pageSize }) => ({
        url: '/list-customers-v2',
        method: 'POST',
        body: {
          page: page.toString(),
          limit: pageSize.toString(),
          //   search: 'Dairo',
          //   order: 'name',
        },
      }),
    }),
    getAllCustomers: builder.query({
      query: user_id => ({
        url: '/list-customers',
        method: 'POST',
        body: {
          user_id,
          status: 'Active',
        },
      }),
    }),
    getCustomer: builder.query({
      query: id => `/get-customer/${id}`,
    }),
    getNewQuotesOptions: builder.query({
      async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const [
            quoteId,
            prospects,
            programs,
            paymentMethods,
            coupons,
            brokerages,
            states,
            boards = [{ label: 'MIAMI ASSOCIATION OF REALTORS', value: '1' }],
          ] = await Promise.all([
            fetchWithBQ({ url: '/get-next-quote', method: 'POST' }).then(
              ({ data }) => data,
            ),
            //* el campo prospecto, se muestra name, se envia el id, como prospect_id
            fetchWithBQ({ url: '/list-prospects', method: 'POST' }).then(
              ({ data }) =>
                data.map(({ name, id }) => ({
                  label: name,
                  value: id,
                })),
            ),
            //* el campo de Program, se muestra el name y se envia el id, como plan_id
            fetchWithBQ({
              url: '/list-plans',
              method: 'POST',
              body: JSON.stringify({
                company: args?.company,
              }),
            }).then(({ data }) =>
              data.map(({ name, id, has_idx }) => ({
                label: name,
                value: id,
                has_idx,
              })),
            ),
            //* el campo payment_method se muestra el name, se envia un array de id, como payment_method
            fetchWithBQ({ url: '/list-payment_method', method: 'POST' }).then(
              ({ data }) =>
                data.map(({ name, slug }) => ({
                  label: name,
                  value: slug,
                })),
            ),
            //* el campo coupon, se muestra el name, se envia el id, como coupon_id
            fetchWithBQ({ url: '/list-coupons', method: 'POST' }).then(
              ({ data }) =>
                [{ label: 'None', value: '' }].slice().concat(
                  data.map(({ name }) => ({
                    label: name,
                    value: name,
                  })),
                ),
            ),
            //* el campo de brokerage no se envia al endpoint de crear quota, es solo filtro
            fetch(`${VITE_APP_API_PACKAGE_BUILDER}/company-list`)
              .then(res => res.json())
              .then(data =>
                data.map(({ name, slug }) => ({
                  label: name,
                  value: slug,
                })),
              ),
            fetchWithBQ({
              url: '/list-state',
              method: 'POST',
            }).then(({ data }) =>
              data.map(({ name, slug }) => ({
                label: name,
                value: slug,
              })),
            ),
            fetch(`${VITE_APP_API_BACKOFFICE}/getBoards`, {
              method: 'POST',
            })
              .then(res => res.json())
              .then(data =>
                data.map(({ name, id }) => ({
                  label: name,
                  value: id,
                })),
              ),
          ])
          return {
            data: {
              quoteId,
              prospects,
              brokerages,
              programs,
              boards,
              paymentMethods,
              coupons,
              states,
            },
          }
        } catch (error) {
          console.log(error)
          return {
            error: 'Ocurrio un error inesperado.',
          }
        }
      },
    }),
    createProspect: builder.mutation({
      query: ({
        name,
        last_name,
        city,
        postal_code,
        email,
        phone,
        state,
        street1,
        street2,
        board,
        user_id,
        user_name,
      }) => ({
        url: '/create-prospect',
        method: 'POST',
        body: {
          name,
          last_name,
          city,
          postal_code,
          email,
          phone,
          state,
          street1,
          street2,
          board,
          user_id,
          user_name,
        },
      }),
    }),
    createQuote: builder.mutation({
      query: ({
        quote_name,
        prospect_id,
        customer_id,
        coupon_id,
        plan_id,
        board_id,
        board_name,
        user_id,
        user_name,
        send_email,
        total_amount,
        total_setup,
        discount,
        bundle_type_id,
        membership_type_id,
        items,
        payment_method,
        has_trial,
        trial_length,
      }) => ({
        url: '/create-quote',
        method: 'POST',
        body: {
          quote_name,
          prospect_id,
          customer_id,
          coupon_id,
          plan_id,
          board_id,
          board_name,
          user_id,
          user_name,
          send_email,
          total_amount,
          total_setup,
          discount,
          bundle_type_id,
          membership_type_id,
          items,
          payment_method,
          has_trial,
          trial_length,
        },
      }),
    }),
  }),
})

export default billing

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCustomersQuery,
  useGetCustomerQuery,
  useGetAllCustomersQuery,
  useGetNewQuotesOptionsQuery,
  useCreateProspectMutation,
  useCreateQuoteMutation,
} = billing
