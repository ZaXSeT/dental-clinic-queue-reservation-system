"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { officeInfo } from "@/lib/data";

export default function Footer() {
    const pathname = usePathname();

    return (
        <footer className="w-full bg-slate-50 text-slate-600 py-12 md:py-16 px-6 border-t border-slate-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 mb-12 md:mb-16 text-center md:text-left">
                <div className="flex flex-col gap-6 items-center md:items-start">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                        <div className="h-8 w-8 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        Dental
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Office</h3>
                        <p className="max-w-xs leading-relaxed">
                            {officeInfo.address.line1}<br />
                            {officeInfo.address.line2}
                        </p>
                        <p className="font-bold text-primary">{officeInfo.phone}</p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 items-center md:items-start">
                    <h3 className="text-lg font-bold text-slate-900">Practice</h3>
                    <div className="flex flex-col gap-2">
                        {pathname === '/' ? (
                            <>
                                <a href="#home" className="hover:text-primary transition-colors cursor-pointer">Home</a>
                                <a href="#workflow" className="hover:text-primary transition-colors cursor-pointer">About</a>
                                <a href="#treatments" className="hover:text-primary transition-colors cursor-pointer">Services</a>
                                <a href="#dentists" className="hover:text-primary transition-colors cursor-pointer">Dentists</a>
                                <Link href="/booking" className="hover:text-primary transition-colors">New Patients</Link>
                                <a href="#contact" className="hover:text-primary transition-colors cursor-pointer">Contact</a>
                            </>
                        ) : (
                            <>
                                <Link href="/?scrollTo=home" scroll={false} className="hover:text-primary transition-colors">Home</Link>
                                <Link href="/?scrollTo=workflow" scroll={false} className="hover:text-primary transition-colors">About</Link>
                                <Link href="/?scrollTo=treatments" scroll={false} className="hover:text-primary transition-colors">Services</Link>
                                <Link href="/?scrollTo=dentists" scroll={false} className="hover:text-primary transition-colors">Dentists</Link>
                                <Link href="/booking" className="hover:text-primary transition-colors">New Patients</Link>
                                <Link href="/?scrollTo=contact" scroll={false} className="hover:text-primary transition-colors">Contact</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 text-center md:text-left">
                <p>© 2026 Dental Clinic. All rights reserved.</p>
                <div className="flex gap-6 justify-center md:justify-start">
                    <Link href="/privacy-terms" className="hover:text-primary transition-colors">Privacy & Terms</Link>

                </div>
            </div>
        </footer>
    );
}
