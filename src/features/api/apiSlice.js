import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { userLoggedOut } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
	baseUrl: 'http://localhost:9000',
	prepareHeaders: (headers, { getState }) => {
		const { accessToken } = getState().auth;

		if (accessToken) {
			headers.set('Authorization', 'Bearer ' + accessToken);
		}

		return headers;
	},
});

const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: async (args, api, extraOptions) => {
		const result = await baseQuery(args, api, extraOptions);

		if (result?.error && result?.error?.status === 401) {
			localStorage.removeItem('auth');

			api.dispatch(userLoggedOut());
		}

		return result;
	},
	// eslint-disable-next-line no-unused-vars
	endpoints: (builder) => ({}),
});

export default apiSlice;
