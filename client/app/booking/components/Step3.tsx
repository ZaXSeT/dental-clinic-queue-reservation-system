"use client";

import { ArrowLeft, ChevronRight, ChevronLeft } from "lucide-react";
import { Doctor, DateInfo, BookingSelection } from "@/lib/types";

interface Step3Props {
    bookingData: BookingSelection | null;
    dentists: Doctor[];
    dates: DateInfo[];
    dateOffset: number;
    doctorAvailability: Record<string, Record<string, string[]>>;
    onBooking: (dentistId: string, date: string, time: string) => void;
    onBack: () => void;
    onNext: () => void;
    onPrevDates: () => void;
    onNextDates: () => void;
}

export default function Step3({
    bookingData,
    dentists,
    dates,
    dateOffset,
    doctorAvailability,
    onBooking,
    onBack,
    onNext,
    onPrevDates,
    onNextDates
}: Step3Props) {
    const visibleDates = dates.slice(dateOffset, dateOffset + 4);

    return (
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="bg-white rounded-[3rem] p-8 w-full max-w-[95%] shadow-xl shadow-slate-200/40 border border-slate-50 relative">
                <div className="flex flex-col items-center justify-center mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="hidden md:inline">Back</span>
                        </button>
                    </div>

                    <span className="px-4 py-1.5 rounded-full bg-sky-50 text-[#009ae2] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
                        FINAL PHASE 3/3
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900">Select Date & Time</h1>

                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <button
                            disabled={!bookingData}
                            onClick={onNext}
                            className={`flex items-center gap-2 font-bold px-6 py-2 rounded-full transition-all ${bookingData ? 'bg-[#009ae2] text-white shadow-md shadow-blue-200 hover:scale-105' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8 flex-1 min-h-0">
                    <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden h-full flex flex-col">
                        <div className="hidden md:grid grid-cols-[1.2fr_repeat(4,1fr)] border-b border-slate-100 bg-slate-50 flex-none relative">
                            <div className="absolute inset-y-0 right-0 w-[80%] pointer-events-none flex justify-between items-center px-2">
                                <button
                                    onClick={onPrevDates}
                                    disabled={dateOffset === 0}
                                    className={`pointer-events-auto p-2 rounded-full hover:bg-slate-200 transition-colors z-20 ${dateOffset === 0 ? 'opacity-0' : 'text-slate-500'}`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={onNextDates}
                                    disabled={dateOffset >= dates.length - 4}
                                    className={`pointer-events-auto p-2 rounded-full hover:bg-slate-200 transition-colors z-20 ${dateOffset >= dates.length - 4 ? 'opacity-0' : 'text-slate-500'}`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 text-center"><span className="text-xs font-bold text-slate-500 tracking-wider">DOCTOR</span></div>
                            {visibleDates.map((day, idx) => (
                                <div key={idx} className="p-4 text-center border-l border-slate-100 relative z-10 bg-transparent flex flex-col justify-center h-full">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{day.dayName}</div>
                                    <div className="text-xl font-bold text-slate-800 leading-none mb-1">{day.dayNumber}</div>
                                    <div className="text-[9px] font-bold text-[#009ae2] uppercase tracking-wide">{day.monthName}</div>
                                </div>
                            ))}
                        </div>

                        <div className="divide-y divide-slate-100 bg-white">
                            {dentists.map((dentist) => (
                                <div key={dentist.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_repeat(4,1fr)] h-[300px] group hover:bg-slate-50/30 transition-colors">
                                    <div className="p-6 flex flex-col items-center justify-start text-center pt-8">
                                        <div className="relative mb-3">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-white bg-slate-100">
                                                <img src={dentist.image || "/resources/avatar-placeholder.png"} alt={dentist.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 leading-tight mb-1">{dentist.name}</h3>
                                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wide">{dentist.specialization}</p>
                                    </div>

                                    <div className="col-span-4 hidden md:grid grid-cols-4">
                                        {visibleDates.map((day, idx) => {
                                            const slots = doctorAvailability[dentist.id]?.[day.dayName] || [];
                                            return (
                                                <div key={idx} className="p-2 border-l border-slate-50 flex flex-col gap-2 items-center justify-start py-4">
                                                    {slots.length > 0 ? slots.map((time) => {
                                                        const isSelected = bookingData?.dentistId === dentist.id && bookingData?.date === day.fullDate && bookingData?.time === time;
                                                        return (
                                                            <button
                                                                key={time}
                                                                onClick={() => onBooking(dentist.id, day.fullDate, time)}
                                                                className={`
                                                                w-full py-3 rounded-xl border text-sm font-bold transition-all duration-200
                                                                ${isSelected
                                                                        ? 'bg-[#009ae2] text-white border-[#009ae2] shadow-md transform scale-105'
                                                                        : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:shadow-sm'
                                                                    }
                                                            `}
                                                            >
                                                                {time}
                                                            </button>
                                                        );
                                                    }) : <span className="text-slate-200 text-lg">•</span>}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="md:hidden p-4 text-center border-t border-slate-50">
                                        <span className="text-xs text-slate-400">Desktop view only</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 flex-shrink-0 h-full">
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden relative h-full min-h-[500px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1990.9793064873745!2d98.74442617036429!3d3.596959756178393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d0d6826859%3A0xd4b27636dae03e17!2sGo%20Dental%20Clinic%20(Part%20Of%20Medan%20Dental%20Center)!5e0!3m2!1sen!2sid!4v1768770602878!5m2!1sen!2sid"
                                className="absolute inset-0 w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
