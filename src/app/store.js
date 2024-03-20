import { configureStore } from '@reduxjs/toolkit';
import apiSlice from '../features/api/apiSlice';

const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddlewares) =>
		getDefaultMiddlewares().concat(apiSlice.middleware),
	devTools: import.meta.env.DEV,
});

export default store;
