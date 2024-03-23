import apiSlice from '../api/apiSlice';

const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: ({ conversationId }) =>
				`/messages/${conversationId}?_sort=timestamp&_order=desc&_page=1&_limit=5`,
		}),
	}),
});

export default messagesApi;
export const { useGetMessagesQuery } = messagesApi;
