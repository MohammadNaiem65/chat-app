import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: 'http://localhost:9000',
	}),
	// eslint-disable-next-line no-unused-vars
	endpoints: (builder) => ({}),
});

export default apiSlice;
