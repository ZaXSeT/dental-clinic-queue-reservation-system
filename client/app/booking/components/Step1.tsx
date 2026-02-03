"use client";

import { ChevronRight } from "lucide-react";
import { PatientType } from "@/lib/types";

interface Step1Props {
    onSelect: (type: PatientType) => void;
}

export default function Step1({ onSelect }: Step1Props) {
    
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-xl shadow-slate-200/40 text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-[#009ae2] text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                    BOOKING PHASE 1/3
                </span>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">Who are you</h1>
                <h1 className="text-4xl font-bold text-slate-900 mb-12">booking for?</h1>

                <div className="space-y-4">
                    <button
                        onClick={() => onSelect('new')}
                        className="w-full bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="text-left">
                                <div className="font-bold text-lg text-slate-900 group-hover:text-[#009ae2] transition-colors">New patient</div>
                                <div className="text-slate-400 text-sm">First time visiting us</div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#009ae2] transition-all duration-300 group-hover:scale-110">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </button>

                    <button
                        onClick={() => onSelect('returning')}
                        className="w-full bg-white border border-slate-100 rounded-[2rem] p-6 flex items-center justify-between hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
                    >
                        <div className="flex items-center gap-6">
                            <div className="text-left">
                                <div className="font-bold text-lg text-slate-900 group-hover:text-[#009ae2] transition-colors">Returning patient</div>
                                <div className="text-slate-400 text-sm">Have been here before</div>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#009ae2] transition-all duration-300 group-hover:scale-110">
                            <ChevronRight className="w-5 h-5" />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
