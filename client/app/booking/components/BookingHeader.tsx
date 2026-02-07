"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BookingHeaderProps {
    step: number;
}

export default function BookingHeader({ step }: BookingHeaderProps) {
    const router = useRouter();

    return (
        <nav className="w-full max-w-[95%] h-24 flex items-center justify-between relative mx-auto">
            <div className="z-10 flex-shrink-0">
                <button onClick={() => router.push('/')} className="flex items-center gap-3 text-slate-400 font-bold hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="hidden md:inline text-sm">Back to Home</span>
                </button>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                <img
                    src="/resources/clean.png"
                    alt="Dental Logo"
                    className="h-10 w-auto object-contain"
                    style={{ filter: 'invert(49%) sepia(38%) saturate(3015%) hue-rotate(175deg) brightness(96%) contrast(101%)' }}
                />
                <span className="text-3xl font-bold tracking-tight text-[#009ae2]">Dental</span>
            </div>

            <div className="z-10 flex gap-3 flex-shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#009ae2] scale-110' : 'bg-slate-200'}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#009ae2] scale-110' : 'bg-slate-200'}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#009ae2] scale-110' : 'bg-slate-200'}`}></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            </div>
        </nav>
    );
}
