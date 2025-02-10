import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routes/routes"; // Import `rootRoute`
// Create router instance
const router = createRouter({ routeTree: routeTree });

// Register the router type globally
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

export default function App() {
	return <RouterProvider router={router} />;
}
