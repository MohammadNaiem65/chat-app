import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import routes from './routes/routes';
import store from './app/store';

function App() {
	return (
		<Provider store={store}>
			<RouterProvider router={routes} />
		</Provider>
	);
}

export default App;
