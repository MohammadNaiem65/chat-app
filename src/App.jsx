import { RouterProvider } from 'react-router-dom';
import routes from './routes/routes';
import { useAuthCheck } from './hooks';

function App() {
	const authChecked = useAuthCheck();

	return !authChecked ? (
		<p className='m-5 text-2xl text-center font-semibold'>
			Auth Checking... Please wait!
		</p>
	) : (
		<RouterProvider router={routes} />
	);
}

export default App;
