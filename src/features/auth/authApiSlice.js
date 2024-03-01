import { apiSlice } from "../../app/api/apiSlice"

export const authApiSlice = apiSlice.injectEndpoints({
    endpoint: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/auth',
                method: 'POST',
                body: { ...credentials }
            })
        })
    })
})