import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "@/backend/supabase/supabaseClient";
import { RootState } from "@/store/store";
import { useNavigate, Outlet, createRootRoute } from "@tanstack/react-router";
import DashboardNavbar from "@/components/DashboardNavbar";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Breadcrumb } from "@/components/breadcrumb/breadcrumb";
import { setLoading, setSession } from "@/store/slices/authSlice";
import Navbar from "@/components/Navbar";

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

export default function RootComponent() {
    const dispatch = useDispatch();
    const { session, loading }: any = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSession() {
            const { data } = await supabase.auth.getSession();
            dispatch(setSession(data.session));
            dispatch(setLoading(false));
        }
        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            dispatch(setSession(session));
        });

        return () => subscription?.unsubscribe();
    }, [dispatch]);


    useEffect(() => {
        if (!loading && !session) {
            navigate({ to: "/auth/signin", replace: true });
        }
    }, [session, loading, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        return (
            <div>
                <Navbar/>
                <Outlet/>
            </div>
        )
    }

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
                </main>
            </section>
        </div>
    )
}
