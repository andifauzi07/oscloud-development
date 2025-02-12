import { Outlet } from "@tanstack/react-router";
import { Breadcrumb } from "./breadcrumb/breadcrumb";
import DashboardNavbar from "./DashboardNavbar";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className=" w-full h-full ">
      <DashboardNavbar />
      <section className="bg-slate-50  w-full flex h-[calc(100vh-var(--top-navbar-height))] ">
        <aside className="flex-shrink-0 overflow-hidden sticky top-0 h-full w-[var(--sidebar-width)]">
          <Sidebar />
        </aside>

        <main className=" flex-1 min-h-0 h-full flex flex-col overflow-auto">
          <Header />
          <Breadcrumb />
          <Outlet />
        </main>
      </section>
    </div>
  );
};

export default DashboardLayout;
