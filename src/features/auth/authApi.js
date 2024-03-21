import apiSlice from '../api/apiSlice';
import { userLoggedIn } from './authSlice';

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
			async onQueryStarted(arg, { queryFulfilled, dispatch }) {
				const { data } = await queryFulfilled;
				const { accessToken, user } = data || {};

				// save auth credentials to local storage
				localStorage.setItem(
					'auth',
					JSON.stringify({ accessToken, user })
				);

				// save auth credentials to redux store
				dispatch(userLoggedIn({ accessToken, user }));
			},
		}),
	}),
});

export default authApi;
export const { useRegisterMutation, useLoginMutation } = authApi;
