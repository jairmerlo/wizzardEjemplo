import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API } from "../../api"
import { sorterAlphabetically } from "../../helpers"

export const billing = createApi({
  reducerPath: "billing",
  baseQuery: fetchBaseQuery({
    baseUrl: API._BILLING_HOST,
    headers: {
      "Content-Type": "application/json",
    },
  }),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getCustomers: builder.query({
      query: ({ page = 0, pageSize = 0 }) => ({
        url: "/list-customers-v2",
        method: "POST",
        body: {
          page: page.toString(),
          limit: pageSize.toString(),
          //   search: 'Dairo',
          //   order: 'name',
        },
      }),
    }),
    getAllCustomers: builder.query({
      query: ({ filter, user_id, users }) => ({
        url: "/list-customers",
        method: "POST",
        body: {
          user_id,
          status: "Active",
          filter,
          users,
        },
      }),
    }),
    getItemsByProgram: builder.query({
      query: ({ plan_code }) => ({
        url: "/get-item-to-subscription-byprogram",
        method: "POST",
        body: {
          plan_code,
        },
      }),
    }),
    getListAbandonedCard: builder.query({
      query: () => ({
        url: "/list-abandoned-cart",
        method: "POST",
      }),
    }),
    getAllCustomersV3: builder.query({
      query: ({ filter, user_id, users }) => ({
        url: "/list-customers-v3",
        method: "POST",
        body: {
          user_id,
          status: "Active",
          filter,
          users,
        },
      }),
    }),
    sendQuote: builder.mutation({
      query: ({ quote_id, user_id, user_name }) => ({
        url: `/send-quote`,
        method: "POST",
        body: {
          quote_id,
          user_id,
          user_name,
        },
      }),
    }),
    deleteQuote: builder.mutation({
      query: ({ quoteId }) => ({
        url: `/quote-delete/${quoteId}`,
        method: "DELETE",
      }),
    }),
    getCustomer: builder.query({
      query: (id) => `/get-customer-v2/${id}`,
    }),
    getCustomerV1: builder.query({
      query: (uuid) => `/get-customer/${uuid}`,
    }),
    getCustomerV2Billing: builder.query({
      query: (customerId) => `/get-customer-v2-billing/${customerId}`,
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
            boards = [{ label: "MIAMI ASSOCIATION OF REALTORS", value: "1" }],
            listMembership,
            listBundle,
          ] = await Promise.all([
            fetchWithBQ({ url: "/get-next-quote", method: "POST" }).then(
              ({ data }) => data
            ),
            //* el campo prospecto, se muestra name, se envia el id, como prospect_id
            fetchWithBQ({ url: "/list-prospects", method: "POST" }).then(
              ({ data }) =>
                sorterAlphabetically(
                  data.map(({ name, id, email }) => ({
                    label: `${name} (${email})`,
                    value: id,
                  })),
                  "label"
                )
            ),
            //* el campo de Program, se muestra el name y se envia el id, como plan_id
            fetchWithBQ({
              url: "/list-plans",
              method: "POST",
              body: JSON.stringify({
                company: args?.company,
                has_trial: args?.has_trial,
              }),
            }).then(({ data }) => {
              return sorterAlphabetically(
                data.map(
                  ({ name, id, has_idx, code, total_amount, total_setup }) => ({
                    label: `${code} ${name}`,
                    value: id,
                    has_idx,
                    total_amount,
                    total_setup,
                  })
                ),
                "label"
              )
            }),
            //* el campo payment_method se muestra el name, se envia un array de id, como payment_method
            fetchWithBQ({ url: "/list-payment_method", method: "POST" }).then(
              ({ data }) =>
                sorterAlphabetically(
                  data.map(({ name, slug }) => ({
                    label: name,
                    value: slug,
                  })),
                  "label"
                )
            ),
            //* el campo coupon, se muestra el name, se envia el id, como coupon_id
            fetchWithBQ({ url: "/list-coupons-v2", method: "POST" }).then(
              ({ data }) =>
                [{ label: "None", value: "" }].slice().concat(
                  sorterAlphabetically(
                    data.map(({ name }) => ({
                      label: name,
                      value: name,
                    })),

                    "label"
                  )
                )
            ),
            //* el campo de brokerage no se envia al endpoint de crear quota, es solo filtro
            fetch(`${API._PACKAGE_BUILDER}/company-list`)
              .then((res) => res.json())
              .then((data) =>
                sorterAlphabetically(
                  data.map(({ name, id }) => ({
                    label: name,
                    value: id,
                  })),
                  "label"
                )
              ),
            fetchWithBQ({
              url: "/list-state",
              method: "POST",
            }).then(({ data }) =>
              data.map(({ name, slug }) => ({
                label: name,
                value: slug,
              }))
            ),
            fetch(`${API._BACKOFFICE}/getBoards`, {
              method: "POST",
            })
              .then((res) => res.json())
              .then((data) =>
                [{ label: "None", value: "" }].slice().concat(
                  sorterAlphabetically(
                    data.map(({ name, id }) => ({
                      label: name,
                      value: id,
                    })),

                    "label"
                  )
                )
              ),
            fetchWithBQ({
              url: "/list-membership-type",
              method: "POST",
            }).then(({ data }) =>
              data.map(({ name, id }) => ({
                label: name,
                value: id,
              }))
            ),
            fetchWithBQ({
              url: "/list-bundle-type",
              method: "POST",
            }).then(({ data }) =>
              data.map(({ name, id }) => ({
                label: name,
                value: id,
              }))
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
              listBundle,
              listMembership,
            },
          }
        } catch (error) {
          console.log(error)
          return {
            error: "Ocurrio un error inesperado.",
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
        url: "/create-prospect",
        method: "POST",
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
    modifyQuote: builder.mutation({
      query: ({
        id,
        project_name,
        prospect_id,
        customer_id,
        coupon_id,
        plan_id,
        board_id,
        board_name,
        user_id,
        user_name,
        expiration_date,
        is_valid,
        status,
        send_email,
        bundle_type_id,
        payment_method,
        total_amount,
        total_setup,
        membership_type_id,
        items,
        show_cupon_wizard,
        has_trial,
        trial_length,
      }) => ({
        url: "/modify-quote",
        method: "PUT",
        body: {
          id,
          project_name,
          prospect_id,
          customer_id,
          coupon_id,
          plan_id,
          board_id,
          board_name,
          user_id,
          user_name,
          expiration_date,
          is_valid,
          status,
          send_email,
          bundle_type_id,
          payment_method,
          total_amount,
          total_setup,
          membership_type_id,
          items,
          show_cupon_wizard,
          has_trial,
          trial_length,
        },
      }),
    }),
    createQuote: builder.mutation({
      query: ({
        project_name,
        // quote_name,
        // prospect_id,
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
        show_cupon_wizard,
        trial_length,
      }) => ({
        url: "/create-quote",
        method: "POST",
        body: {
          project_name,
          // quote_name,
          // prospect_id,
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
          show_cupon_wizard,
          trial_length,
        },
      }),
    }),
    getStates: builder.query({
      query: () => ({
        url: `/list-state`,
        method: "POST",
      }),
    }),
    getAuthorizationForms: builder.query({
      query: ({ id, registration_key, authorization_form_type, order }) => ({
        url: "/list-authorization-form",
        method: "POST",
        body: {
          authorization_form_type,
          order,
          registration_key,
          id,
        },
      }),
    }),
    sendAuthorizationForm: builder.mutation({
      query: ({
        authorization_form_type,
        registration_key,
        user_id,
        labels_prices,
      }) => ({
        url: "/authorization-form-send",
        method: "POST",
        body: {
          authorization_form_type,
          registration_key,
          user_id,
          labels_prices,
        },
      }),
    }),
    resendAuthorizationForm: builder.mutation({
      query: ({
        authorization_form_type,
        registration_key,
        user_id,
        labels_prices,
        send_email,
        id,
      }) => ({
        url: "/authorization-form-re-send",
        method: "POST",
        body: {
          authorization_form_type,
          registration_key,
          user_id,
          labels_prices,
          send_email,
          id,
        },
      }),
    }),
    abandonedCardStep1: builder.mutation({
      query: ({
        customer_id,
        type,
        url_origin,
        name,
        last_name,
        email,
        phone,
        country,
        city,
      }) => ({
        url: "/wizard/abandoned-card-step1",
        method: "POST",
        body: {
          customer_id,
          type,
          url_origin,
          name,
          last_name,
          email,
          phone,
          country,
          city,
        },
      }),
    }),
    processNotificationStep1: builder.mutation({
      query: ({ type, first_name, last_name, email, phone }) => ({
        url: "wizard/process-notification-step1",
        method: "POST",
        body: {
          type,
          first_name,
          last_name,
          email,
          phone,
        },
      }),
    }),
    registerBillingV2: builder.mutation({
      query: ({
        project_name,
        type,
        name,
        last_name,
        email,
        phone,
        customer_id,
        checkout_session_id,
        password,
        ip,
        country,
        city,
      }) => ({
        url: "wizard/register-billing-v2",
        method: "POST",
        body: {
          project_name,
          type,
          name,
          last_name,
          email,
          phone,
          customer_id,
          checkout_session_id,
          password,
          ip,
          country,
          city,
        },
      }),
    }),
    saveHtmlWizard: builder.mutation({
      query: ({
        payment_html,
        program_html,
        registration_key,
        initial_price,
        plan_code,
        monthly_price,
        email,
      }) => ({
        url: "save-html-wizard",
        method: "POST",
        body: {
          payment_html,
          program_html,
          registration_key,
          initial_price,
          plan_code,
          monthly_price,
          email,
        },
      }),
    }),
    billingEnrollment: builder.mutation({
      query: ({
        registration_key,
        user_id,
        program_code,
        periods_setupfee = 0,
        setupfee,
        startdate_setupfee,
        periods_monthly,
        monthly,
        startdate_monthly,
      }) => ({
        url: "/program-enrollment",
        method: "POST",
        body: {
          registration_key,
          program_code,
          periods_setupfee,
          setupfee,
          startdate_setupfee,
          periods_monthly,
          monthly,
          startdate_monthly,
          user_id,
        },
      }),
    }),
    idxResendAgreementEmail: builder.mutation({
      query: ({ registration_key, program_name }) => ({
        url: "/idx-resend-agreement-email",
        method: "POST",
        body: {
          registration_key,
          program_name,
        },
      }),
    }),
    replaceAuthorizationForm: builder.mutation({
      query: ({
        authorization_form_type,
        registration_key,
        user_id,
        labels_prices,
      }) => ({
        url: "/authorization-form-replace",
        method: "POST",
        body: {
          authorization_form_type,
          registration_key,
          user_id,
          labels_prices,
        },
      }),
    }),
    websitePublishedEmail: builder.mutation({
      query: ({ registration_key, domain_name, ip, date }) => ({
        url: "/website-published-email",
        method: "POST",
        body: {
          registration_key,
          domain_name,
          ip,
          date,
        },
      }),
    }),
    // addPayment: builder.mutation({
    //   query: ({
    //     registration_key,
    //     paidDate,
    //     amount,
    //     invoiceNumber,
    //     invoicePeriodInit,
    //     invoicePeriodEnd,
    //     sourcePayment,
    //     programName,
    //     programCode,
    //     attachFile,
    //     note
    //   }) => ({
    //     url: '/addPayment',
    //     method: 'POST',
    //     body: {
    //       registration_key,
    //       paidDate,
    //       amount,
    //       invoiceNumber,
    //       invoicePeriodInit,
    //       invoicePeriodEnd,
    //       sourcePayment,
    //       programName,
    //       programCode,
    //       attachFile,
    //       note
    //     },
    //   }),
    // }),
    editCustomer: builder.mutation({
      query: ({
        city,
        company,
        company_id,
        display_name_as,
        email_contact,
        id,
        last_name,
        name,
        phone,
        postal_code,
        principal_membership,
        profile_deployment,
        profile_marketing,
        profile_project_manager,
        state,
        street1,
        street2,
        uuid,
      }) => ({
        url: "/modify-customer",
        method: "PUT",
        body: {
          city,
          company,
          company_id,
          display_name_as,
          email_contact,
          id,
          last_name,
          name,
          phone,
          postal_code,
          principal_membership,
          profile_deployment,
          profile_marketing,
          profile_project_manager,
          state,
          street1,
          street2,
          uuid,
        },
      }),
    }),
    getProductOptions: builder.query({
      async queryFn(args, _queryApi, _extraOptions, fetchWithBQ) {
        try {
          const [products, categories, groups] = await Promise.all([
            fetchWithBQ({
              url: "/items-bycompany",
              method: "POST",
              body: {
                company_id: args?.company_id,
                program_id: args?.program_id,
              },
            })
              .then(({ data }) => data)
              .then((data) =>
                data.map(({ name, item_id, currencies_format }) => ({
                  label: name,
                  value: item_id,
                  currencies_format: currencies_format,
                }))
              ),
            fetchWithBQ({
              url: "/list-bundle-type",
              method: "POST",
              body: {
                company: args?.company,
              },
            })
              .then(({ data }) => data)
              .then((data) =>
                data.map(({ name }) => ({ label: name, value: name }))
              ),
            fetchWithBQ({
              url: "/product_group/list",
            })
              .then(({ data }) => data)
              .then((data) =>
                data.map(({ name }) => ({ label: name, value: "" }))
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
      query: (id) => ({
        url: "/get-pdf-access",
        method: "POST",
        body: {
          id,
        },
      }),
    }),
    getTrialDays: builder.query({
      query: () => ({
        url: "/list-trial-days",
        method: "POST",
      }),
    }),
    getListCountry: builder.query({
      query: (id) => ({
        url: "/list-country",
        method: "POST",
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
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/list-account-invoice-byregkey",
            {
              method: "post",
              body: JSON.stringify({
                registration_key,
              }),
            }
          ).then((res) => res.json())

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
    getThirdStepInformation: builder.query({
      queryFn: async (
        { registration_key, program_code },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/wizard/get-third-step-information",
            {
              method: "post",
              body: JSON.stringify({
                registration_key,
                program_code,
              }),
            }
          ).then((res) => res.json())

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
    getPlanByregistrationKey: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/get-plan-byregistration_key",
            {
              method: "POST",
              body: JSON.stringify({
                registration_key,
              }),
            }
          ).then((res) => res.json())

          return {
            data: res.map(({ name, code, total_amount, total_setup }) => ({
              label: `${code} ${name}`,
              value: code,
              setupfee: total_setup,
              monthly: total_amount,
            })),
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getPlanByregistrationKeyV2: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/get-plan-byregistration_key",
            {
              method: "POST",
              body: JSON.stringify({
                registration_key,
              }),
            }
          ).then((res) => res.json())

          return {
            data: res.map(({ name, code, total_amount, total_setup }) => ({
              label: name,
              value: name,
              code,
            })),
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getCompanyByRegistrationKey: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/company-by-registration_key",
            {
              method: "POST",
              body: JSON.stringify({
                registration_key,
              }),
            }
          ).then((res) => res.json())

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
    getRequestByregKey: builder.query({
      queryFn: async ({ registration_key }) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/get-request-byreg-key",
            {
              method: "post",
              body: JSON.stringify({
                registration_key,
              }),
            }
          ).then((res) => res.json())

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
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/get-all-agreement-byrkey",
            {
              method: "post",
              body: JSON.stringify({
                registration_key,
              }),
            }
          ).then((res) => res.json())

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
    getHtmlWizard: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(API._BILLING_HOST + "/get-html-wizard", {
            method: "post",
            body: JSON.stringify({
              registration_key,
            }),
          }).then((res) => res.json())

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
            API._BILLING_HOST + "/get-invoice-pdf/" + id,
            {
              method: "get",
            }
          ).then((res) => res.json())

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
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(API._BILLING_HOST + "/billing-information", {
            method: "post",
            body: JSON.stringify({
              registration_key,
            }),
          }).then((res) => res.json())

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
    plansFiltered: builder.query({
      queryFn: async (
        {
          company = 0,
          bundle_type = 0,
          membership_type = 0,
          stripe = true,
          has_trial = false,
        },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(API._BILLING_HOST + "/plans-filtered", {
            method: "post",
            body: JSON.stringify({
              company,
              bundle_type,
              membership_type,
              stripe,
              has_trial,
            }),
          }).then((res) => res.json())
          return {
            data: res.map(
              ({
                name,
                value,
                total_amount,
                total_setup,
                has_idx,
                trial_quote,
              }) => ({
                label: name,
                value,
                total_amount,
                total_setup,
                has_idx,
                trial_quote,
              })
            ),
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getPlanBycompanyId: builder.query({
      queryFn: async ({ company = 0 }, _api, _extraOptions, fetchWithBQ) => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/get-plan-bycompany_id",
            {
              method: "POST",
              body: JSON.stringify({
                company,
              }),
            }
          ).then((res) => res.json())
          return {
            data: res.map(({ name, code, total_amount, total_setup }) => ({
              label: `${code} ${name}`,
              value: code,
              setupfee: total_setup,
              monthly: total_amount,
            })),
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    listMembershipType: builder.query({
      queryFn: async (
        { bundle_type_id = 0 },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(API._BILLING_HOST + "/list-membership-type", {
            method: "post",
            body: JSON.stringify({
              bundle_type_id,
            }),
          }).then((res) => res.json())

          return {
            data: res.map(({ id, name }) => ({
              label: name,
              value: id,
            })),
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getQuoteByname: builder.query({
      queryFn: async (
        { quote_name = "" },
        _api,
        _extraOptions,
        fetchWithBQ
      ) => {
        try {
          const res = await fetch(API._BILLING_HOST + "/get-quote-byname", {
            method: "POST",
            body: JSON.stringify({
              quote_name,
            }),
          }).then((res) => res.json())

          return { data: res }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getProviderAccount: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(
            API._BILLING_HOST + "/merchant_provider_account/list",
            {
              method: "POST",
            }
          ).then((res) => res.json())

          return {
            data: res.map(({ name }) => ({
              label: name,
              value: name,
            })),
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getCustomerId: builder.mutation({
      queryFn: async ({ apiKey, name, phone, email, metadata }) => {
        try {
          const url = `${API._STRIPE}/customers?apiKey=${apiKey}`
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
              name,
              phone,
              email,
              metadata,
            }),
          }).then((res) => res.json())

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
    updateCustomer: builder.mutation({
      queryFn: async ({ customerId, metadata, address, name }) => {
        try {
          const url = `${API._STRIPE}/customers/${customerId}`
          const res = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({
              name,
              address,
              metadata,
            }),
          }).then((res) => res.json())

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
    paymentMethod: builder.mutation({
      queryFn: async ({ customerId, items, token, days, months }) => {
        try {
          const url = `${API._STRIPE}/subscriptions/payment-method`
          const res = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
              customerId,
              items,
              token,
              days,
              months,
            }),
          }).then((res) => res.json())

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
    // getItemsByProduct: builder.mutation({
    //   queryFn: async ({ apiKey, plan_code }) => {
    //     try {
    //       const url = `${API._BILLING_HOST}/get-item-to-subscription-byprogram`
    //       const res = await fetch(url, {
    //         method: "POST",
    //         body: JSON.stringify({
    //           plan_code,
    //         }),
    //       }).then((res) => res.json())

    //       return {
    //         data: res,
    //       }
    //     } catch (error) {
    //       return {
    //         error,
    //       }
    //     }
    //   },
    // }),
  }),
})

export default billing

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetPdfQuery,
  useGetTrialDaysQuery,
  useGetListCountryQuery,
  useGetCustomersQuery,
  useGetCustomerQuery,
  useGetAllCustomersQuery,
  useGetItemsByProgramQuery,
  useGetListAbandonedCardQuery,
  useGetAllCustomersV3Query,
  useGetNewQuotesOptionsQuery,
  useCreateProspectMutation,
  useModifyQuoteMutation,
  useCreateQuoteMutation,
  useGetAuthorizationFormsQuery,
  useSendAuthorizationFormMutation,
  useResendAuthorizationFormMutation,
  useAbandonedCardStep1Mutation,
  useProcessNotificationStep1Mutation,
  useRegisterBillingV2Mutation,
  useSaveHtmlWizardMutation,
  useBillingEnrollmentMutation,
  useIdxResendAgreementEmailMutation,
  useReplaceAuthorizationFormMutation,
  useWebsitePublishedEmailMutation,
  // useAddPaymentMutation,
  useEditCustomerMutation,
  useGetProductOptionsQuery,
  useListAccountInvoiceByRegkeyQuery,
  useGetThirdStepInformationQuery,
  useGetPlanByregistrationKeyQuery,
  useGetPlanByregistrationKeyV2Query,
  useGetCompanyByRegistrationKeyQuery,
  useGetRequestByregKeyQuery,
  useGetPdfInvoiceQuery,
  useListAgreementByRegkeyQuery,
  useGetHtmlWizardQuery,
  useBillingInformationQuery,
  usePlansFilteredQuery,
  useGetPlanBycompanyIdQuery,
  useListMembershipTypeQuery,
  useGetQuoteBynameQuery,
  useGetProviderAccountQuery,
  useGetCustomerIdMutation,
  useUpdateCustomerMutation,
  usePaymentMethodMutation,
  useGetCustomerV1Query,
  useGetCustomerV2BillingQuery,
  useSendQuoteMutation,
  useDeleteQuoteMutation,
  useGetStatesQuery,
} = billing
