import { Outlet } from "@tanstack/react-router";
import { Breadcrumb } from "./breadcrumb/breadcrumb";
import DashboardNavbar from "./DashboardNavbar";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

const DashboardLayout = () => {
    return (
        <>
            <div className="w-full h-full ">
                <DashboardNavbar />
                <section className="bg-slate-50  w-full flex h-[calc(100vh-var(--top-navbar-height))] ">
                    <aside className="flex-shrink-0 overflow-hidden sticky top-0 h-full w-[var(--sidebar-width)]">
                        <Sidebar />
                    </aside>

                    <main className="flex flex-col flex-1 h-full min-h-0 overflow-auto ">
                        <Header />
                        <Breadcrumb />
                        <Outlet />
                        <TanStackRouterDevtools />
                    </main>
                </section>
            </div>
        </>
    );
};

export default DashboardLayout;
