"use client";

import Link from "next/link";
import { useState, useEffect, startTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { School, ScrollText, FileText, LayoutDashboard, Users, LogOut, Tv, Calendar, Settings, Stethoscope, ChevronRight, Mail, CreditCard } from "lucide-react";

import { clsx } from "clsx";
import { logoutAction } from "@/actions/auth";

export default function AdminPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const [user, setUser] = useState<{ name: string, role: string, username: string } | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLogout = () => {
        startTransition(async () => {
            await logoutAction();
            sessionStorage.removeItem('staff_auth');
            sessionStorage.removeItem('staff_user');
            router.push('/admin/login');
        });
    };

    useEffect(() => {
        const storedUser = sessionStorage.getItem('staff_user');

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setIsLoaded(true);
    }, [pathname]);

    if (!isLoaded) return null;

    const basePath = '/admin/portal';

    const navItems = [
        {
            label: 'Dashboard',
            href: `${basePath}/dashboard`,
            icon: LayoutDashboard,
        },
        {
            label: "Queue Control",
            href: `${basePath}/queue`,
            icon: Tv,
        },
        {
            label: "Patients",
            href: `${basePath}/patients`,
            icon: Users,
            roles: ['owner', 'admin']
        },
        {
            label: "Doctors",
            href: `${basePath}/doctors`,
            icon: Stethoscope,
        },
        {
            label: "Messages",
            href: `${basePath}/Messages`,
            icon: Mail,
        },
        {
            label: "Billing",
            href: `${basePath}/billing`,
            icon: CreditCard,
            roles: ['owner', 'admin']
        },
    ].filter(item => {
        if (!item.roles) return true;
        return user && item.roles.includes(user.role);
    });

    return (
        <div className="flex h-screen bg-slate-50/50 font-sans text-slate-900">
            <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] relative z-20">
                <div className="p-6 border-b border-slate-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-primary shadow-lg shadow-primary/20" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        <div>
                            <h1 className="font-bold text-lg tracking-tight text-slate-900">Dental</h1>
                            <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">Admin Portal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Main Menu
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "group flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium text-sm relative overflow-hidden",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/25"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={clsx("h-5 w-5 transition-transform duration-200 group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <ChevronRight className="h-4 w-4 ml-auto opacity-75" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3.5 w-full text-left rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-medium group"
                    >
                        <LogOut className="h-5 w-5 group-hover:text-red-600 text-slate-400 transition-colors" />
                        <span>Sign Out</span>
                    </button>
                    <div className="mt-4 px-2 text-xs text-slate-400 text-center font-medium">
                        &copy; 2026 Dental Clinic
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50 relative">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            {pathname !== '/admin/portal/dashboard' && (
                                <button
                                    onClick={() => router.push('/admin/portal/dashboard')}
                                    className="p-1.5 -ml-2 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                    title="Back to Dashboard"
                                >
                                    <ChevronRight className="h-5 w-5 rotate-180" />
                                </button>
                            )}
                            <h2 className="text-xl font-bold text-slate-800">
                                {navItems.find(i => i.href === pathname)?.label || "Dashboard"}
                            </h2>
                        </div>
                        <span className="text-sm text-slate-500">Welcome back, {user?.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-slate-200 shadow-sm">
                            <div className="h-8 w-8 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm text-center">
                                {user?.name?.[0] || 'A'}
                            </div>
                            <div className="text-left mr-2">
                                <div className="text-sm font-bold text-slate-900 leading-none">{user?.name}</div>
                                <div className="text-[10px] text-slate-500 font-medium capitalize">{user?.role}</div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-auto p-8 custom-scrollbar scroll-smooth">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}