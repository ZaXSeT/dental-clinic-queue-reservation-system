"use client";

import { ArrowLeft, ChevronRight } from "lucide-react";
import { PatientType } from "@/lib/types";

interface Step2Props {
    patientType: PatientType;
    onSelect: (type: string) => void;
    onBack: () => void;
}

const OPTIONS = [
    "Hygiene (Cleaning)",
    "Whitening",
    "Clear Aligner Consult",
    "Consultation (Problem Focused)",
];

export default function Step2({ patientType, onSelect, onBack }: Step2Props) {
    const options = patientType === 'new' ? OPTIONS : OPTIONS;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in slide-in-from-right-8 duration-500">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-xl shadow-slate-200/40 text-center relative">
                <div className="absolute left-8 top-8">
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-[#009ae2] text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                    BOOKING PHASE 2/3
                </span>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">What type of</h1>
                <h1 className="text-3xl font-bold text-slate-900 mb-10">appointment?</h1>

                <div className="space-y-4">
                    {options.map((type) => (
                        <button
                            key={type}
                            onClick={() => onSelect(type)}
                            className="w-full bg-white border border-slate-100 rounded-[1.5rem] p-6 flex items-center justify-between hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
                        >
                            <span className="font-bold text-lg text-slate-700 group-hover:text-[#009ae2] transition-colors text-left">{type}</span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#009ae2] transition-all">
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
