import { useParams } from 'react-router-dom';

import Message from './Message';
import { useGetMessagesQuery } from '../../features/message/messageApi';
import Error from '../ui/Error';

export default function Messages({ user }) {
	const { id } = useParams();
	const {
		data: messages,
		isLoading,
		isError,
		error,
	} = useGetMessagesQuery({ conversationId: id });

	let content;
	if (isLoading) {
		content = <p className='m-3 font-semibold'>Loading...</p>;
	} else if (!isLoading && isError) {
		content = <Error message={error?.data} />;
	} else if (!isLoading && !isError && messages?.length === 0) {
		content = <p>No messages found...</p>;
	} else if (!isLoading && !isError && messages?.length > 0) {
		content = (
			<>
				{messages.map((message) => (
					<Message
						key={message?.id}
						message={message?.message}
						justify={
							message?.sender?.email === user?.email
								? 'end'
								: 'start'
						}
					/>
				))}
			</>
		);
	}

	return (
		<div className='relative w-full h-[calc(100vh_-_197px)] p-6 overflow-y-auto flex flex-col-reverse'>
			<ul className='space-y-2'>{content}</ul>
		</div>
	);
}
