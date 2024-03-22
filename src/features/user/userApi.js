import apiSlice from '../api/apiSlice';

const userApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUser: builder.query({
			query: (email) => `/users?email=${email}`,
		}),
	}),
});

export default userApi;
export const { useGetUserQuery } = userApi;
