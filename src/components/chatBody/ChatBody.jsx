import { useSelector } from 'react-redux';
import gravatarUrl from 'gravatar-url';

import ChatHead from './ChatHead';
import Messages from './Messages';
import Options from './Options';

import { useFindPartner } from '../../hooks';
import conversationApi from '../../features/conversation/conversationApi';

export default function ChatBody() {
	const { user } = useSelector((state) => state.auth);

	// get the conversations form the cache
	const { data: conversations, isLoading: gettingConversationIsLoading } =
		conversationApi.endpoints.getConversations.useQueryState(user?.email);

	// get partner details
	const partner = useFindPartner(
		user?.email,
		conversations?.length && conversations[0].users
	);

	return gettingConversationIsLoading ? (
		<p className='m-3 font-semibold'>Loading...</p>
	) : (
		!gettingConversationIsLoading && conversations?.length > 0 && (
			<div className='w-full lg:col-span-2 lg:block'>
				<div className='w-full grid conversation-row-grid'>
					<ChatHead
						avatar={gravatarUrl(partner?.email)}
						name={partner?.name}
					/>
					<Messages user={user} />
					<Options />
				</div>
			</div>
		)
	);
}
