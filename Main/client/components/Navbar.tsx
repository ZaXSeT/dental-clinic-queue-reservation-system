"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, User } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [patient, setPatient] = useState<{ name: string; email: string } | null>(null);
    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        fetch('/api/patient/me')
            .then(r => r.json())
            .then(d => {
                setPatient(d.loggedIn ? { name: d.name, email: d.email } : null);
                setSessionChecked(true);
            })
            .catch(() => setSessionChecked(true));
    }, [pathname]);

    const handleLogout = async () => {
        await fetch('/api/patient/logout', { method: 'POST' });
        setPatient(null);
        router.push('/');
        router.refresh();
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center w-full px-6 md:px-12 py-5">
                {pathname === '/' ? (
                    <a href="#home" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary cursor-pointer">
                        <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        <span>Dental</span>
                    </a>
                ) : (
                    <Link href="/?scrollTo=home" scroll={false} className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
                        <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        <span>Dental</span>
                    </Link>
                )}
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-8 font-medium text-slate-600">
                        {pathname === '/' ? (
                            <>
                                <a href="#workflow" className="hover:text-primary transition-colors cursor-pointer">About</a>
                                <a href="#treatments" className="hover:text-primary transition-colors cursor-pointer">Services</a>
                                <a href="#dentists" className="hover:text-primary transition-colors cursor-pointer">Dentists</a>
                                <a href="#contact" className="hover:text-primary transition-colors cursor-pointer">Inquiry</a>
                            </>
                        ) : (
                            <>
                                <Link href="/?scrollTo=workflow" scroll={false} className="hover:text-primary transition-colors cursor-pointer">About</Link>
                                <Link href="/?scrollTo=treatments" scroll={false} className="hover:text-primary transition-colors cursor-pointer">Services</Link>
                                <Link href="/?scrollTo=dentists" scroll={false} className="hover:text-primary transition-colors cursor-pointer">Dentists</Link>
                                <Link href="/?scrollTo=contact" scroll={false} className="hover:text-primary transition-colors cursor-pointer">Inquiry</Link>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        {sessionChecked && patient ? (
                            <>
                                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200">
                                    <User className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-bold text-slate-600 max-w-[90px] truncate">{patient.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    title="Log Out"
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-red-200 text-red-500 hover:bg-red-50 font-bold text-xs transition-all"
                                >
                                    <LogOut className="w-3.5 h-3.5" />
                                    <span className="hidden sm:block">Log Out</span>
                                </button>
                            </>
                        ) : sessionChecked ? (
                            <Link
                                href="/login"
                                className="px-5 py-2.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white font-bold transition-all text-sm"
                            >
                                Login
                            </Link>
                        ) : null}
                        <Link
                            href="/booking"
                            className="px-5 py-2.5 rounded-full bg-primary hover:bg-sky-600 text-white font-bold transition-all shadow-lg hover:shadow-primary/40 text-sm"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
