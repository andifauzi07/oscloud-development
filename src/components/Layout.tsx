import { Outlet } from "@tanstack/react-router";

const Layout = () => {
	return (
		<div className="bg-slate-50 h-full">
			<Outlet />
		</div>
	);
};

export default Layout;
