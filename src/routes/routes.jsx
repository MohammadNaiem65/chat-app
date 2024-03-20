import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Conversation from '../pages/Conversation';
import Inbox from '../pages/Inbox';

const routes = createBrowserRouter([
	{
		path: '/',
		element: <Login />,
	},
	{
		path: '/register',
		element: <Register />,
	},
	{
		path: '/inbox',
		element: <Conversation />,
	},
	{
		path: '/conversation',
		element: <Conversation />,
	},
	{
		path: '/inbox/:id',
		element: <Inbox />,
	},
]);

export default routes;
