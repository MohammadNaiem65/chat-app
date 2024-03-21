import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:9000',
		prepareHeaders: (headers, { getState }) => {
			const { accessToken } = getState().auth;

			if (accessToken) {
				headers.set('Authorization', 'Bearer ' + accessToken);
			}

			return headers;
		},
	}),
	// eslint-disable-next-line no-unused-vars
	endpoints: (builder) => ({}),
});

export default apiSlice;
