import { useState, useEffect } from 'react';

import Error from './ui/Error';
import { useGetUserQuery } from '../features/user/userApi';
import conversationApi, {
	useAddConversationMutation,
	useEditConversationMutation,
} from '../features/conversation/conversationApi';

const emailRegex =
	/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default function Modal({ open, control, user }) {
	const [data, setData] = useState({
		recipient: '',
		message: '',
		partnerExists: null,
		conversationId: null,
	});
	const [error, setError] = useState('');
	const { email: userEmail, name: userName, id: userId } = user || {};

	const { data: partnerDetails } = useGetUserQuery(data.recipient, {
		skip: !data.recipient,
	});
	const {
		email: partnerEmail,
		name: partnerName,
		id: partnerId,
	} = partnerDetails?.length > 0 ? partnerDetails[0] : {};
	const { data: conversations } =
		conversationApi.endpoints.getConversations.useQueryState(userEmail);

	const [
		addConversation,
		{
			isSuccess: addingProcessSuccess,
			isError: addingProcessError,
			error: addingError,
		},
	] = useAddConversationMutation();
	const [
		editConversation,
		{
			isSuccess: editingProcessSuccess,
			isError: editingProcessError,
			error: editingError,
		},
	] = useEditConversationMutation();

	const handleSetEmail = (e) => {
		setError('');
		const providedEmail = e.target.value;
		const validEmail = providedEmail.match(emailRegex);

		if (validEmail?.length > 0 && validEmail?.input) {
			setData((prev) => ({ ...prev, recipient: validEmail.input }));
		}
	};

	const handleDebounce = () => {
		let timeout;
		return (...args) => {
			if (timeout) {
				clearTimeout(timeout);
			}

			timeout = setTimeout(() => {
				handleSetEmail(...args);
			}, 750);
		};
	};

	const handleSendConversation = (e) => {
		e.preventDefault();

		const conversation = {
			participants: `${userEmail}-${partnerEmail}`,
			users: [
				{
					id: userId,
					name: userName,
					email: userEmail,
				},
				{
					id: partnerId,
					name: partnerName,
					email: partnerEmail,
				},
			],
			message: data.message,
			timestamp: Date.now(),
		};

		if (data?.conversationId) {
			editConversation({
				id: data.conversationId,
				userEmail,
				data: conversation,
			});
		} else {
			addConversation({ userEmail, data: conversation });
		}

		// reset states
		setData({
			recipient: '',
			message: '',
			partnerExists: null,
			conversationId: null,
		});
	};

	// resist messaging to own
	useEffect(() => {
		if (userEmail === data?.recipient) {
			setError('You can not message yourself');
		}
	}, [userEmail, data?.recipient]);

	// decide what to do after getting partner details
	useEffect(() => {
		if (Array.isArray(partnerDetails) && partnerDetails.length > 0) {
			const conversationExists = conversations.find((conversation) =>
				conversation.users.find((user) => user?.id === partnerId)
			);

			if (conversationExists) {
				setData((prev) => ({
					...prev,
					partnerExists: true,
					conversationId: conversationExists.id,
				}));
			} else {
				setData((prev) => ({ ...prev, partnerExists: true }));
			}
		} else if (
			Array.isArray(partnerDetails) &&
			partnerDetails.length === 0
		) {
			setData((prev) => ({ ...prev, partnerExists: false }));
			setError('No user found for this email address');
		}
	}, [partnerDetails, conversations, partnerId]);

	useEffect(() => {
		setError('');
	}, [data?.message]);

	// handle adding or editing process error
	useEffect(() => {
		if (addingProcessError || editingProcessError) {
			setError(addingError?.data ? addingError.data : editingError?.data);
		}
	}, [
		addingProcessError,
		editingProcessError,
		addingError?.data,
		editingError?.data,
	]);

	// handle adding or editing process success
	useEffect(() => {
		if (addingProcessSuccess || editingProcessSuccess) {
			control();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [addingProcessSuccess, editingProcessSuccess]);

	return (
		open && (
			<>
				<div
					onClick={control}
					className='fixed w-full h-full inset-0 z-10 bg-black/50 cursor-pointer'
				/>
				<div className='rounded w-[400px] lg:w-[600px] space-y-8 bg-white p-10 absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2'>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
						Send message
					</h2>
					<form
						className='mt-8 space-y-6'
						onSubmit={handleSendConversation}>
						<div className='rounded-md shadow-sm -space-y-px'>
							<div>
								<label htmlFor='to' className='sr-only'>
									To
								</label>
								<input
									id='to'
									name='to'
									type='to'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Send to'
									onChange={handleDebounce()}
								/>
							</div>
							<div>
								<label htmlFor='message' className='sr-only'>
									Message
								</label>
								<textarea
									id='message'
									name='message'
									type='message'
									required
									className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 focus:z-10 sm:text-sm'
									placeholder='Message'
									value={data.message}
									onChange={(e) =>
										setData((prev) => ({
											...prev,
											message: e.target.value,
										}))
									}
								/>
							</div>
						</div>

						<div>
							<button
								type='submit'
								disabled={
									!data.recipient || !data.message || error
								}
								className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 disabled:bg-violet-700 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500'>
								Send Message
							</button>
						</div>

						{error && <Error message={error} />}
					</form>
				</div>
			</>
		)
	);
}
