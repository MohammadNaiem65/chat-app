import apiSlice from '../api/apiSlice';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversations: builder.query({
			query: (email) => ({
				url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc`,
			}),
		}),
	}),
});

export default conversationApi;
export const { useGetConversationsQuery } = conversationApi;
