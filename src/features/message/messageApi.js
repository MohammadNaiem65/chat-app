import apiSlice from '../api/apiSlice';

const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: ({ conversationId }) =>
				`/messages?conversationId=${conversationId}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
		}),
		addMessage: builder.mutation({
			query: ({ data }) => ({
				url: '/messages',
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export default messagesApi;
export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
