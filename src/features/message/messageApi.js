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

			async onQueryStarted({ data }, { queryFulfilled, dispatch }) {
				// optimistically update messages cache
				const patchResult = dispatch(
					apiSlice.util.upsertQueryData(
						'getMessages',
						{ conversationId: data?.conversationId?.toString() },
						[data]
					)
				);

				try {
					await queryFulfilled;
				} catch (error) {
					patchResult.undo();
				}
			},
		}),
	}),
});

export default messagesApi;
export const { useGetMessagesQuery, useAddMessageMutation } = messagesApi;
