"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const getLinkHref = (id: string) => {
        return pathname === '/' ? `#${id}` : `/?scrollTo=${id}`;
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/40 shadow-lg transition-all duration-300">
            <div className="flex justify-between items-center w-full px-6 md:px-12 py-5">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
                    <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                    <span>Dental</span>
                </Link>
                <div className="flex items-center gap-8">
                    <div className="hidden md:flex gap-8 font-medium text-slate-600">
                        {pathname === '/' ? (
                            <>
                                <a href="#workflow" className="hover:text-primary transition-colors cursor-pointer">About</a>
                                <a href="#dentists" className="hover:text-primary transition-colors cursor-pointer">Dentists</a>
                                <a href="#contact" className="hover:text-primary transition-colors cursor-pointer">Contact</a>
                            </>
                        ) : (
                            <>
                                <Link href="/?scrollTo=workflow" className="hover:text-primary transition-colors cursor-pointer">About</Link>
                                <Link href="/?scrollTo=dentists" className="hover:text-primary transition-colors cursor-pointer">Dentists</Link>
                                <Link href="/?scrollTo=contact" className="hover:text-primary transition-colors cursor-pointer">Contact</Link>
                            </>
                        )}
                    </div>
                    <div className="flex gap-4">
                        <Link href="/booking" className="px-5 py-2.5 rounded-full bg-primary hover:bg-sky-600 text-white font-bold transition-all shadow-lg hover:shadow-primary/40">
                            Book Now
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
