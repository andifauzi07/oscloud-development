import { createRoute } from "@tanstack/react-router";
import Employee from "../pages/employee/Employee";
import Profile from "../pages/employee/profile";
import { dashboardParentRoute } from "./privateRoutes";

export const EmployeeRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee",
  component: Employee,
});

export const EmployeeProfile = createRoute({
  getParentRoute: () => EmployeeRoute,
  path: "/employee/$name",
  component: Profile,
});

EmployeeRoute.addChildren([EmployeeProfile]);
