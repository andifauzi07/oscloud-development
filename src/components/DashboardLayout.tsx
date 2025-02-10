import DashboardNavbar from "./DashboardNavbar";
import Sidebar from "./Sidebar";
import { Outlet } from "@tanstack/react-router";

const DashboardLayout = () => {
	return (
		<div className="flex flex-col h-screen">
			<DashboardNavbar />
			<div className="bg-slate-50 h-full flex">
				<Sidebar />
				<Outlet />
			</div>
		</div>
	);
};

export default DashboardLayout;
