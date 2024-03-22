import apiSlice from '../api/apiSlice';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversations: builder.query({
			query: (email) => ({
				url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc`,
			}),
		}),
		addConversation: builder.mutation({
			query: ({ data }) => ({
				url: '/conversations',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted({ userEmail }, { queryFulfilled, dispatch }) {
				try {
					const { data: newConversation } = await queryFulfilled;

					// pessimistic conversation cache update
					if (newConversation?.id) {
						dispatch(
							apiSlice.util.updateQueryData(
								'getConversations',
								userEmail,
								(draft) => {
									draft.unshift(newConversation);
								}
							)
						);
					}
				} catch (err) {
					// handle error in the ui
				}
			},
		}),
		editConversation: builder.mutation({
			query: ({ id, data }) => ({
				url: `/conversations/${id}`,
				method: 'PATCH',
				body: data,
			}),
			async onQueryStarted(
				{ id, userEmail, data },
				{ queryFulfilled, dispatch }
			) {
				const patchResult = dispatch(
					apiSlice.util.updateQueryData(
						'getConversations',
						userEmail,
						(draft) => {
							const conversationToEdit = draft.find(
								(c) => c.id == id
							);

							conversationToEdit.message = data.message;
							conversationToEdit.timestamp = data.timestamp;
						}
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

export default conversationApi;
export const {
	useGetConversationsQuery,
	useAddConversationMutation,
	useEditConversationMutation,
} = conversationApi;
