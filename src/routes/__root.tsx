import { useEffect } from "react";
import { Link, Outlet, createRootRoute, useNavigate } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import DashboardNavbar from "@/components/DashboardNavbar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import "@/styles/app.css";
import { useAuth } from "@/context/AuthContext";

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" },
            { title: "oscloud" },
        ],
    }),
    component: RootComponent,
});

function RootComponent() {
    const { session, loading } = useAuth();
    useEffect(() => {
        console.log({ session, loading })
    }, [])
    const navigate = useNavigate();

    return (
        <div className="w-full h-full text-black rounded-none">
            <DashboardNavbar />
            <section className="bg-slate-50 w-full flex h-[calc(100vh-var(--top-navbar-height))] rounded-none">
                <aside className="flex-shrink-0 overflow-hidden sticky top-0 h-full w-[var(--sidebar-width)] rounded-none">
                    <Sidebar />
                </aside>
                <main className="flex flex-col flex-1 h-full min-h-0 overflow-auto rounded-none">
                    <Header />
                    <Breadcrumb />
                    <Outlet />
                    <TanStackRouterDevtools />
                </main>
            </section>
        </div>
    );
}
