import { useSelector } from 'react-redux';
import { useGetConversationsQuery } from '../features/conversation/conversationApi';

import ChatItem from './ChatItem';
import Error from './ui/Error';

export default function ChatItems() {
	const { user } = useSelector((state) => state.auth);
	const {
		data: conversations,
		isLoading,
		isError: processIsError,
		error: processError,
	} = useGetConversationsQuery(user?.email);

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
			.map((conversation) => (
				<ChatItem key={conversation.id} conversation={conversation} />
			));
	}

	return (
		<ul>
			<li>
				{/* <ChatItem
					avatar='https://cdn.pixabay.com/photo/2018/09/12/12/14/man-3672010__340.jpg'
					name='Saad Hasan'
					lastMessage='bye'
					lastTime='25 minutes'
				/>
*/}
				{content}
			</li>
		</ul>
	);
}
