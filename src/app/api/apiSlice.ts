import { BaseQueryApi, FetchArgs, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { setCredentials, logOut } from '../../features/auth/authSlice'
import { RootState } from '../store'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8000',
    credentials: 'include',
    prepareHeaders: (headers: Headers, api: Pick<BaseQueryApi, "getState" | "extra" | "endpoint" | "type" | "forced">) => {
        const authState = (api.getState() as RootState).auth;
        const token = authState && authState.user && (authState.user as { token?: string }).token;
        if (token) {
            headers.set("Authorization", `${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    let result = await baseQuery(args, api, extraOptions)

    if ([403, 401].includes(result?.error?.status as number)) {
        console.log('sending refresh token')
        const refreshResult = await baseQuery('/refresh', api, extraOptions)
        if(refreshResult?.data) {
            const user = (api.getState() as RootState).auth.user
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            result = await baseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logOut({}))
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})