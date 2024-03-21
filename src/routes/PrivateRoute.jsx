import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function PrivateRoute({ children }) {
	const userExists = useAuth();

	return userExists ? children : <Navigate to='/' />;
}
