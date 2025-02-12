import { createRoute } from "@tanstack/react-router";
import DashboardLayout from "../components/DashboardLayout";
// import { getSession } from "../backend/auth/auth";

import {
  EmployeeProfile,
  EmployeeRoute,
  EmployeeRoute_setting,
  EmployeeRoute_table,
  SettingCategoryRoute,
  SettingDepartmentRoute,
  shiftScheduleRoute,
} from "./employee_routes/employee.route";
import { rootRoute } from "./rootRoutes";

// Parent route for all dashboard-related pages
export const dashboardParentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayout,
  // beforeLoad: async () => {
  // 	const session = await getSession(); // Fetch session
  // 	if (!session) {
  // 		throw redirect({ to: "/signin" }); // Redirect if no session
  // 	}
  // },
});

// Export all private routes
export const privateRoutes = [
  dashboardParentRoute.addChildren([
    EmployeeRoute,
    EmployeeProfile,
    EmployeeRoute_setting,
    EmployeeRoute_table,
    shiftScheduleRoute,
    SettingCategoryRoute,
    SettingDepartmentRoute,
  ]),
];
