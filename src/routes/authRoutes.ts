import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./rootRoutes";
import SignIn from "../pages/auth/SignIn";
import { getSession } from "../backend/auth/auth";
import SignUp from "../pages/auth/SignUp";

export const signInRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/signin",
	component: SignIn,
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

export const signUpRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/signup",
	component: SignUp,
	beforeLoad: async () => {
		const session = await getSession();
		if (session) {
			throw redirect({ to: "/dashboard" });
		}
	},
});

export const authRoutes = [signInRoute, signUpRoute];
