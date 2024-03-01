import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { setCredentials, logOut } from '../../features/auth/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if(token) {
            headers.set("Authorization", `${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    let result = await baseQuery(args, api, extraOptions)

    if ([403, 401].includes(result?.error?.status as number)) {
        console.log('sending refresh token')
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        if(refreshResult?.data) {
            const user = api.getState.auth.user
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut())
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})