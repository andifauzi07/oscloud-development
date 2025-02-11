import { Router } from "@tanstack/react-router";
import { authRoutes } from "./authRoutes";
import { privateRoutes } from "./privateRoutes";
import { rootRoute } from "./rootRoutes";

export const routeTree = rootRoute.addChildren([
  ...authRoutes,
  ...privateRoutes,
]);

export const router = new Router({ routeTree });
