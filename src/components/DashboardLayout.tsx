import { Outlet } from "@tanstack/react-router";
import DashboardNavbar from "./DashboardNavbar";
import Sidebar from "./Sidebar";
import { Breadcrumb } from "./breadcrumb/breadcrumb";

const DashboardLayout = () => {
  return (
    <div className="min-h-[calc(100vh)]">
      <DashboardNavbar />
      <section className="bg-slate-50  h-[calc(100vh-var(--top-navbar-height))] w-full flex">
        <aside className="flex-shrink-0 h-full w-[var(--sidebar-width)]">
          <Sidebar />
        </aside>

        <main className="h-full flex-1">
          <Breadcrumb />
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
