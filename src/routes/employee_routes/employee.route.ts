import { createRoute } from "@tanstack/react-router";
import Employee from "../../pages/employee/Employee";
import EmployeeSetting from "../../pages/employee/Employee.setting";
import EmployeeTable from "../../pages/employee/Employee.table";
import { Profile } from "../../pages/employee/profile/profile";
import ShiftSchedule from "../../pages/employee/profile/shift.schedule";
import Category from "../../pages/employee/setting/category";
import Department from "../../pages/employee/setting/department";
import { dashboardParentRoute } from "../privateRoutes";

export const EmployeeRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee",
  component: Employee,
});

export const EmployeeRoute_setting = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee/setting",
  component: EmployeeSetting,
});

export const EmployeeRoute_table = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee/table",
  component: EmployeeTable,
});

// profile routes

export const EmployeeProfile = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee/$userId/profile",
  component: Profile,
});

export const shiftScheduleRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee/$userId/profile/shift-schedule",
  component: ShiftSchedule,
});

export const SettingCategoryRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee/setting/category",
  component: Category,
});

export const SettingDepartmentRoute = createRoute({
  getParentRoute: () => dashboardParentRoute,
  path: "/employee/setting/department",
  component: Department,
});
