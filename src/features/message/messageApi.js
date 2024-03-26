import { io } from 'socket.io-client';
import apiSlice from '../api/apiSlice';
import { useFindUser } from '../../hooks';

const messagesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getMessages: builder.query({
			query: ({ conversationId }) =>
				`/messages?conversationId=${conversationId}&_sort=timestamp&_order=desc&_page=1&_limit=5`,
			async onCacheEntryAdded(
				args,
				{
					cacheDataLoaded,
					cacheEntryRemoved,
					updateCachedData,
					getState,
				}
			) {
				// create socket instance
				const socket = io('http://localhost:9000', {
					withCredentials: true,
				});

				try {
					await cacheDataLoaded;

					socket.on('message', (data) => {
						const { data: message } = data || {};
						const { conversationId, receiver } = message || {};

						const { email: userEmail } = getState().auth.user;
						// check if the message is for the current user
						const messageForUser = useFindUser(userEmail, [
							receiver,
						]);

						if (messageForUser?.id) {
							updateCachedData((draft) => {
								const messageToEdit = draft.find(
									(message) =>
										message?.conversationId ===
										conversationId
								);

								if (messageToEdit?.conversationId) {
									draft.push(message);
								}
							});
						}
					});
				} catch (error) {
					// do nothing
				}

				await cacheEntryRemoved;
				socket.close();
			},
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
