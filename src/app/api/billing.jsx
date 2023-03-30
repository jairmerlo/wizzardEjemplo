import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API } from '../../api'
import { sorterAlphabetically } from '../../helpers'

export const billing = createApi({
  reducerPath: 'billing',
  baseQuery: fetchBaseQuery({
    baseUrl: API._BILLING_HOST,
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
      query: ({ filter, user_id }) => ({
        url: '/list-customers',
        method: 'POST',
        body: {
          user_id,
          status: 'Active',
          filter,
        },
      }),
    }),
    getCustomer: builder.query({
      query: id => `/get-customer-v2/${id}`,
    }),
    getCustomerV1: builder.query({
      query: uuid => `/get-customer/${uuid}`,
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
                sorterAlphabetically(
                  data.map(({ name, id, email }) => ({
                    label: `${name} (${email})`,
                    value: id,
                  })),
                  'label',
                ),
            ),
            //* el campo de Program, se muestra el name y se envia el id, como plan_id
            fetchWithBQ({
              url: '/list-plans',
              method: 'POST',
              body: JSON.stringify({
                company: args?.company,
                has_trial: args?.has_trial,
              }),
            }).then(({ data }) => {
              console.log({ data })
              return sorterAlphabetically(
                data.map(
                  ({ name, id, has_idx, code, total_amount, total_setup }) => ({
                    label: `${code} ${name}`,
                    value: id,
                    has_idx,
                    total_amount,
                    total_setup,
                  }),
                ),
                'label',
              )
            }),
            //* el campo payment_method se muestra el name, se envia un array de id, como payment_method
            fetchWithBQ({ url: '/list-payment_method', method: 'POST' }).then(
              ({ data }) =>
                sorterAlphabetically(
                  data.map(({ name, slug }) => ({
                    label: name,
                    value: slug,
                  })),
                  'label',
                ),
            ),
            //* el campo coupon, se muestra el name, se envia el id, como coupon_id
            fetchWithBQ({ url: '/list-coupons', method: 'POST' }).then(
              ({ data }) =>
                [{ label: 'None', value: '' }].slice().concat(
                  sorterAlphabetically(
                    data.map(({ name }) => ({
                      label: name,
                      value: name,
                    })),

                    'label',
                  ),
                ),
            ),
            //* el campo de brokerage no se envia al endpoint de crear quota, es solo filtro
            fetch(`${API._PACKAGE_BUILDER}/company-list`)
              .then(res => res.json())
              .then(data =>
                sorterAlphabetically(
                  data.map(({ name, slug }) => ({
                    label: name,
                    value: slug,
                  })),
                  'label',
                ),
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
            fetch(`${API._BACKOFFICE}/getBoards`, {
              method: 'POST',
            })
              .then(res => res.json())
              .then(data =>
                [{ label: 'None', value: '' }].slice().concat(
                  sorterAlphabetically(
                    data.map(({ name, id }) => ({
                      label: name,
                      value: id,
                    })),

                    'label',
                  ),
                ),
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
    getAuthorizationForms: builder.query({
      query: ({ id, registration_key, authorization_form_type, order }) => ({
        url: '/list-authorization-form',
        method: 'POST',
        body: {
          authorization_form_type,
          order,
          registration_key,
          id,
        },
      }),
    }),
    sendAuthorizationForm: builder.mutation({
      query: ({ authorization_form_type, registration_key, user_id, labels_prices }) => ({
        url: '/authorization-form-send',
        method: 'POST',
        body: {
          authorization_form_type,
          registration_key,
          user_id,
          labels_prices
        },
      }),
    }),
    resendAuthorizationForm: builder.mutation({
      query: ({ authorization_form_type, registration_key, user_id }) => ({
        url: '/authorization-form-re-send',
        method: 'POST',
        body: {
          authorization_form_type,
          registration_key,
          user_id,
        },
      }),
    }),
    replaceAuthorizationForm: builder.mutation({
      query: ({ authorization_form_type, registration_key, user_id }) => ({
        url: '/authorization-form-replace',
        method: 'POST',
        body: {
          authorization_form_type,
          registration_key,
          user_id,
        },
      }),
    }),
    getProductOptions: builder.query({
      async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const [products, categories, groups] = await Promise.all([
            fetchWithBQ({
              url: '/items-bycompany',
              method: 'POST',
              body: {
                company: args?.company,
              },
            })
              .then(({ data }) => data)
              .then(data =>
                data.map(({ name, item_id }) => ({
                  label: name,
                  value: item_id,
                })),
              ),
            fetchWithBQ({
              url: '/list-bundle-type',
              method: 'POST',
              body: {
                company: args?.company,
              },
            })
              .then(({ data }) => data)
              .then(data =>
                data.map(({ name }) => ({ label: name, value: name })),
              ),
            fetchWithBQ({
              url: '/product_group/list',
            })
              .then(({ data }) => data)
              .then(data =>
                data.map(({ name }) => ({ label: name, value: '' })),
              ),
          ])

          return {
            data: { groups, products, categories },
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getPdf: builder.query({
      query: id => ({
        url: '/get-pdf-access',
        method: 'POST',
        body: {
          id,
        },
      }),
    }),
    listAccountInvoiceByRegkey: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + '/list-account-invoice-byregkey',
            {
              method: 'post',
              body: JSON.stringify({
                registration_key,
              }),
            },
          ).then(res => res.json())

          return {
            data: res,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    listAgreementByRegkey: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + '/get-all-agreement-byrkey',
            {
              method: 'post',
              body: JSON.stringify({
                registration_key,
              }),
            },
          ).then(res => res.json())

          return {
            data: res,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getPdfInvoice: builder.query({
      queryFn: async ({ id }, _api, _extraOptions, fetchWithBQ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + '/get-invoice-pdf/' + id,
            {
              method: 'get',
            },
          ).then(res => res.json())

          return {
            data: res,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    billingInformation: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const res = await fetch(API._BILLING_HOST + '/billing-information', {
            method: 'post',
            body: JSON.stringify({
              registration_key,
            }),
          }).then(res => res.json())

          return {
            data: res,
          }
        } catch (error) {
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
  useGetPdfQuery,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useGetAllCustomersQuery,
  useGetNewQuotesOptionsQuery,
  useCreateProspectMutation,
  useCreateQuoteMutation,
  useGetAuthorizationFormsQuery,
  useSendAuthorizationFormMutation,
  useResendAuthorizationFormMutation,
  useReplaceAuthorizationFormMutation,
  useGetProductOptionsQuery,
  useListAccountInvoiceByRegkeyQuery,
  useGetPdfInvoiceQuery,
  useListAgreementByRegkeyQuery,
  useBillingInformationQuery,
  useGetCustomerV1Query,
} = billing
