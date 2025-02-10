import { createRoute, redirect } from "@tanstack/react-router";
import DashboardLayout from "../components/DashboardLayout";
import { getSession } from "../backend/auth/auth";
import { rootRoute } from "./rootRoutes";

// Parent route for all dashboard-related pages
export const dashboardParentRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/dashboard",
	component: DashboardLayout,
	beforeLoad: async () => {
		const session = await getSession(); // Fetch session
		if (!session) {
			throw redirect({ to: "/signin" }); // Redirect if no session
		}
	},
});

// Export all private routes
export const privateRoutes = [dashboardParentRoute.addChildren([])];
