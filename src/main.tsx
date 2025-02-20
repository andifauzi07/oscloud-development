import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './styles/app.css';

// Set up a Router instance
const router = createRouter({
	routeTree,
	defaultPreload: 'intent',
});

// Register things for typesafety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById('app')!;

if (!rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	);
}
