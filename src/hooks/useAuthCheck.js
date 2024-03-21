import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from '../features/auth/authSlice';

export default function useAuthCheck() {
	const [authChecked, setAuthChecked] = useState(false);
	const dispatch = useDispatch();

	useEffect(() => {
		const localAuth = JSON.parse(localStorage.getItem('auth'));

		if (localAuth?.accessToken && localAuth?.user) {
			dispatch(
				userLoggedIn({
					accessToken: localAuth.accessToken,
					user: localAuth.user,
				})
			);
		}

		setAuthChecked(true);
	}, [dispatch]);

	return authChecked;
}
