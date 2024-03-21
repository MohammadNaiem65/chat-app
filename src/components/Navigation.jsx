import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { lwsDarkLogo } from '../assets';
import { userLoggedOut } from '../features/auth/authSlice';

export default function Navigation() {
	const dispatch = useDispatch();

	const handleLogout = () => {
		localStorage.removeItem('auth');

		dispatch(userLoggedOut());
	};

	return (
		<nav className='border-general sticky top-0 z-40 border-b bg-violet-700 transition-colors'>
			<div className='max-w-7xl mx-auto'>
				<div className='flex justify-between h-16 items-center'>
					<Link to='/'>
						<img
							className='h-10'
							src={lwsDarkLogo}
							alt='Learn with Sumit'
						/>
					</Link>
					<ul>
						<li className='text-white'>
							<button onClick={handleLogout}>Logout</button>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}
