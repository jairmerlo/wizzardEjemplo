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
      queryFn: async ({ filter }, _api, _extraOptions, fetchWithBQ) => {
        try {
          const data = await fetch(API._BACKOFFICE + '/listActiveMemberships', {
            method: 'post',
            body: JSON.stringify({
              filter,
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
  }),
})

export default backoffice

export const { useGetAllMembershipsQuery } = backoffice
