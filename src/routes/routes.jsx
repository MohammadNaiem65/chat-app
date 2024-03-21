import { createBrowserRouter } from 'react-router-dom';

import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
import { Conversation, Inbox, Login, Register } from '../pages';

const routes = createBrowserRouter([
	{
		path: '/',
		element: (
			<PublicRoute>
				<Login />
			</PublicRoute>
		),
	},
	{
		path: '/register',
		element: (
			<PublicRoute>
				<Register />
			</PublicRoute>
		),
	},
	{
		path: '/inbox',
		element: (
			<PrivateRoute>
				<Conversation />
			</PrivateRoute>
		),
	},
	{
		path: '/conversation',
		element: (
			<PrivateRoute>
				<Conversation />
			</PrivateRoute>
		),
	},
	{
		path: '/inbox/:id',
		element: (
			<PrivateRoute>
				<Inbox />
			</PrivateRoute>
		),
	},
]);

export default routes;
