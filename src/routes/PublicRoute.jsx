import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PublicRoute({ children }) {
	const userExists = useAuth();

	return userExists ? <Navigate to='/inbox' /> : children;
}
