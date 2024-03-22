import { Link } from 'react-router-dom';
import gravatarUrl from 'gravatar-url';
import moment from 'moment';

export default function ChatItem({
	conversationId,
	participantDetails,
	timestamp,
	message,
}) {
	const { name, email } = participantDetails || {};

	return (
		<Link
			className='flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none'
			to={`/inbox/${conversationId}`}>
			<img
				className='object-cover w-10 h-10 rounded-full'
				src={gravatarUrl(email)}
				alt={name}
			/>
			<div className='w-full pb-2 hidden md:block'>
				<div className='flex justify-between'>
					<span className='block ml-2 font-semibold text-gray-600'>
						{name}
					</span>
					<span className='block ml-2 text-sm text-gray-600'>
						{moment(timestamp).fromNow()}
					</span>
				</div>
				<span className='block ml-2 text-sm text-gray-600'>
					{message}
				</span>
			</div>
		</Link>
	);
}
