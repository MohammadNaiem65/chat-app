import { io } from 'socket.io-client';
import apiSlice from '../api/apiSlice';
import messagesApi from '../message/messageApi';
import { useFindUser } from '../../hooks';

const conversationApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getConversations: builder.query({
			query: (email) => ({
				url: `/conversations?participants_like=${email}&_sort=timestamp&_order=desc`,
			}),

			async onCacheEntryAdded(
				email,
				{ cacheDataLoaded, cacheEntryRemoved, updateCachedData }
			) {
				// create a socket instance
				const socket = io('http://localhost:9000', {
					withCredentials: true,
				});

				try {
					await cacheDataLoaded;

					socket.on('conversation', (data) => {
						const { data: conversation } = data;

						const {
							id: conversationId,
							users,
							message,
							timestamp,
						} = conversation || {};

						// check if the conversation is for the user
						const conversationForUser = useFindUser(email, users);

						if (conversationForUser?.id) {
							updateCachedData((draft) => {
								const conversationExists = draft.find(
									(c) => c?.id === conversationId
								);

								// edit conversation - if exists
								if (conversationExists?.id) {
									conversationExists.message = message;
									conversationExists.timestamp = timestamp;
								} else {
									// add conversation to draft
									draft.unshift(conversation);
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
		addConversation: builder.mutation({
			query: ({ data }) => ({
				url: '/conversations',
				method: 'POST',
				body: data,
			}),
			async onQueryStarted({ userEmail }, { queryFulfilled, dispatch }) {
				try {
					const { data: newConversation } = await queryFulfilled;

					const {
						id: conversationId,
						users,
						message,
						timestamp,
					} = newConversation || {};

					const messageData = {
						conversationId,
						sender: undefined,
						receiver: undefined,
						message: message,
						timestamp: timestamp,
					};

					users?.forEach((user) => {
						if (user?.email === userEmail) {
							messageData.sender = user;
						} else if (user?.email !== userEmail) {
							messageData.receiver = user;
						}
					});

					// dispatch addMessage thunk
					dispatch(
						messagesApi.endpoints.addMessage.initiate({
							data: messageData,
						})
					).then((res) => {
						const { data } = res;

						// pessimistically update messages cache
						dispatch(
							apiSlice.util.upsertQueryData(
								'getMessages',
								{
									conversationId: conversationId?.toString(),
								},
								[data]
							)
						);
					});

					// pessimistically update conversation cache
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
				// optimistically update the conversations cache
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
					const { data: newConversation } = await queryFulfilled;

					const {
						id: conversationId,
						users,
						message,
						timestamp,
					} = newConversation || {};

					const messageData = {
						conversationId,
						sender: undefined,
						receiver: undefined,
						message: message,
						timestamp: timestamp,
					};

					users?.forEach((user) => {
						if (user?.email === userEmail) {
							messageData.sender = user;
						} else if (user?.email !== userEmail) {
							messageData.receiver = user;
						}
					});

					// dispatch addMessage thunk
					dispatch(
						messagesApi.endpoints.addMessage.initiate({
							data: messageData,
						})
					).then((res) => {
						// pessimistically update the messages cache
						const { data: messageDetails } = res;

						dispatch(
							apiSlice.util.updateQueryData(
								'getMessages',
								{
									conversationId: conversationId.toString(),
								},
								(draft) => {
									draft.push(messageDetails);
								}
							)
						);
					});
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
