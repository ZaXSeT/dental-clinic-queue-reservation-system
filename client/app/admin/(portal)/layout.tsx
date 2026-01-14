"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Tv } from "lucide-react";
import { clsx } from "clsx";

export default function AdminPortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // Clear cookies/tokens here
        router.push("/admin/login");
    };

    const navItems = [
        { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Queue Control", href: "/admin/queue", icon: Tv },
        // { label: "Dentists", href: "/admin/dentists", icon: Users },
    ];

    return (
        <div className="flex h-screen bg-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <div className="text-xl font-bold flex items-center gap-2">
                        <span>🦷</span> Admin Panel
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium",
                                pathname === item.href
                                    ? "bg-primary text-white"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors font-medium"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {navItems.find(i => i.href === pathname)?.label || "Overview"}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-900">Dr. Admin</div>
                            <div className="text-xs text-slate-500">Clinic Manager</div>
                        </div>
                        <div className="h-10 w-10 bg-slate-200 rounded-full"></div>
                    </div>
                </header>

                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
