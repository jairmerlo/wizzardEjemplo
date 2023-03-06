import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { API } from '../../api'

export const backoffice = createApi({
  reducerPath: 'backoffice',
  baseQuery: fetchBaseQuery({
    baseUrl: API._BACKOFFICE,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE',
    },
  }),
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  endpoints: builder => ({
    getAllMemberships: builder.query({
      queryFn: async (
        { filter, customerId },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const data = await fetch(API._BACKOFFICE + '/listActiveMemberships', {
            method: 'post',
            body: JSON.stringify({
              filter,
              customerId,
            }),
          }).then(res => res.json())
          console.log({ data })
          return {
            data,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getMembership: builder.query({
      useErrorBoundary: true,
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const res = await fetch(API._BACKOFFICE + '/getMembership', {
            method: 'post',
            body: JSON.stringify({
              registration_key,
            }),
          }).then(res => res.json())
          const { data } = res
          return {
            data,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getLastActionsMembership: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const { data } = await fetch(
            API._BACKOFFICE + '/getLastActionsMembership',
            {
              method: 'post',
              body: JSON.stringify({
                registration_key,
              }),
            },
          ).then(res => res.json())
          return {
            data,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    getTheamMembership: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const res = await fetch(API._BACKOFFICE + '/getTeamMembership', {
            method: 'post',
            body: JSON.stringify({
              registration_key,
            }),
          }).then(res => res.json())
          const { data } = res
          return {
            data,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),

    getAgentsMembership: builder.query({
      queryFn: async (
        { registration_key },
        _api,
        _extraOptions,
        fetchWithBQ,
      ) => {
        try {
          const res = await fetch(API._BACKOFFICE + '/getAgentsMembership', {
            method: 'post',
            body: JSON.stringify({
              registration_key,
            }),
          }).then(res => res.json())
          const { data } = res
          return {
            data,
          }
        } catch (error) {
          return {
            error,
          }
        }
      },
    }),
    editMembership: builder.mutation({
      // query: ([{ id, username }, body]) => ({
      //   url: `/memberships/v2/edit/${id}/${username}`,
      //   body,
      //   method: 'POST',
      // }),
      queryFn: async ([{ id, username }, body]) => {
        try {
          const res = await fetch(
            API._BACKOFFICE + `/memberships/v2/edit/${id}/${username}`,
            {
              method: 'POST',
              body: JSON.stringify(body),
            },
          )
          const data = await res.json()
          return {
            data,
          }
        } catch (error) {
          console.log({ error })
          return {
            error: 'Error',
          }
        }
      },
    }),
    getTheamProfiles: builder.query({
      queryFn: async () => {
        try {
          const res = await fetch(API._BACKOFFICE + '/getTheamProfiles', {
            method: 'POST',
          })
          const data = await res.json()
          return {
            data,
          }
        } catch (error) {
          console.log({ error })
          return {
            error: 'Error',
          }
        }
      },
    }),
  }),
})

export default backoffice

export const {
  useGetAllMembershipsQuery,
  useGetMembershipQuery,
  useGetTheamMembershipQuery,
  useGetAgentsMembershipQuery,
  useGetLastActionsMembershipQuery,
  useEditMembershipMutation,
  useGetTheamProfilesQuery,
} = backoffice
