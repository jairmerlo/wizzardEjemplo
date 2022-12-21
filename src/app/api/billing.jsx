import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const { VITE_APP_API_BILLING_HOST, VITE_APP_API_PACKAGE_BUILDER } = import.meta
  .env

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
          const [{ data: quoteId }, { data: brokerages }] = await Promise.all([
            fetchWithBQ({ url: '/get-next-quote', method: 'POST' }),
            fetch(`${VITE_APP_API_PACKAGE_BUILDER}/company-list`)
              .then(res => res.json())
              .then(data => ({
                data: data.map(({ name, slug }) => ({
                  label: name,
                  value: slug,
                })),
              })),
          ])
          return {
            data: {
              quoteId,
              brokerages,
            },
          }
        } catch (error) {
          console.log(error)
          return {
            error,
          }
        }
      },
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
} = billing
