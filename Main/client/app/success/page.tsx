"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Calendar, Clock, MapPin, Sparkles, Home, Phone } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    const doctorName = searchParams.get("doctor") || "your doctor";
    const date = searchParams.get("date") || "";
    const time = searchParams.get("time") || "";
    const treatment = searchParams.get("treatment") || "Dental Consultation";
    const patientName = searchParams.get("name") || "";

    useEffect(() => {
        setMounted(true);
    }, []);

    const formattedDate = date
        ? new Date(date + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-6">
            <div
                className={`max-w-lg w-full transition-all duration-700 ${
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
            >
                {/* Success Icon */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-[2rem] shadow-lg shadow-green-100 mb-6">
                        <CheckCircle2 className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                        Appointment Secured!
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {patientName
                            ? `Thank you, ${patientName}! Your visit has been scheduled.`
                            : "Your visit at Go Dental Clinic has been scheduled."}
                    </p>
                </div>

                {/* Booking Card */}
                <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-100 border border-slate-100 overflow-hidden mb-6">
                    {/* Header strip */}
                    <div className="bg-[#009ae2] px-8 py-4 flex items-center justify-between">
                        <span className="text-white text-xs font-black uppercase tracking-widest">
                            Booking Confirmation
                        </span>
                        <span className="text-white/70 text-xs font-bold">Go Dental Clinic</span>
                    </div>

                    <div className="p-8 space-y-5">
                        {/* Treatment */}
                        <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-[#009ae2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Treatment
                                </p>
                                <p className="font-bold text-slate-800">{treatment}</p>
                            </div>
                        </div>

                        {/* Date & Time */}
                        {(formattedDate || time) && (
                            <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
                                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-[#009ae2]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Date & Time
                                    </p>
                                    <p className="font-bold text-slate-800">
                                        {formattedDate || "—"}
                                    </p>
                                    {time && (
                                        <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                            <Clock className="w-3 h-3" /> {time}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Doctor */}
                        <div className="flex items-center gap-4 pb-5 border-b border-slate-50">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <Phone className="w-5 h-5 text-[#009ae2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Doctor
                                </p>
                                <p className="font-bold text-slate-800">{doctorName}</p>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-[#009ae2]" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Location
                                </p>
                                <p className="font-bold text-slate-800">Go Dental Clinic</p>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">
                                    Jl. Bantaran Sungai, Percut Sei Tuan, Deli Serdang
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-6 mb-6">
                    <h4 className="text-sm font-black text-blue-900 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" /> What to do next
                    </h4>
                    <ul className="space-y-3">
                        {[
                            "Datang tepat waktu sesuai jadwal yang dipilih.",
                            "Tunjukkan nama Anda di meja resepsionis.",
                            "Pembayaran dilakukan setelah pemeriksaan selesai.",
                        ].map((step, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-600">
                                <div className="w-5 h-5 rounded-full bg-white border border-blue-200 flex items-center justify-center text-[10px] shrink-0 text-blue-600">
                                    {i + 1}
                                </div>
                                {step}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* CTA */}
                <button
                    onClick={() => router.push("/")}
                    className="w-full h-14 bg-[#009ae2] hover:bg-[#0088cc] active:scale-95 text-white rounded-2xl font-black text-sm uppercase tracking-[0.15em] shadow-xl shadow-[#009ae2]/30 transition-all flex items-center justify-center gap-3"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </button>

                <p className="text-center text-xs text-slate-400 font-bold mt-6">
                    Confirmation details have been sent to your email.
                </p>
            </div>
        </div>
    );
}
