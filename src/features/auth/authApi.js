import apiSlice from '../api/apiSlice';

const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		register: builder.mutation({
			query: (data) => ({
				url: '/users',
				method: 'POST',
				body: data,
			}),
		}),
		login: builder.mutation({
			query: (data) => ({
				url: '/login',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export default authApi;
export const { useRegisterMutation, useLoginMutation } = authApi;
