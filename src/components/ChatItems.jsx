import { useGetConversationsQuery } from '../features/conversation/conversationApi';
import getParticipant from '../utils/getParticipant';

import ChatItem from './ChatItem';
import Error from './ui/Error';

export default function ChatItems({ userEmail }) {
	const {
		data: conversations,
		isLoading,
		isError: processIsError,
		error: processError,
	} = useGetConversationsQuery(userEmail);

	// decide what content to render
	let content;

	if (isLoading) {
		content = (
			<p className='text-slate-700 font-semibold m-3'>
				Loading conversations...
			</p>
		);
	} else if (!isLoading && processIsError) {
		content = <Error message={processError.data} />;
	} else if (!isLoading && !processIsError && conversations.length === 0) {
		content = (
			<p className='text-slate-700 font-semibold m-3'>
				No conversations found...
			</p>
		);
	} else if (!isLoading && !processIsError && conversations.length > 0) {
		content = conversations
			.toSorted((a, b) => b.timestamp - a.timestamp)
			.map((conversation) => {
				const participant = getParticipant(
					userEmail,
					conversation?.users
				);
				return (
					<ChatItem
						key={conversation.id}
						conversationId={conversation.id}
						participantDetails={participant}
						timestamp={conversation.timestamp}
						message={conversation.message}
					/>
				);
			});
	}

	return (
		<ul>
			<li>{content}</li>
		</ul>
	);
}
