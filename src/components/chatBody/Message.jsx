export default function Message({ justify, message }) {
	return (
		<li className={`flex justify-${justify}`}>
			<div
				className={`relative max-w-xl px-4 py-2 rounded shadow ${
					justify === 'end'
						? 'bg-violet-700 text-white'
						: 'text-gray-700'
				}`}>
				<span className='block'>{message}</span>
			</div>
		</li>
	);
}
