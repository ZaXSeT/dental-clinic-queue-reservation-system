"use client";

import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
    const router = useRouter();

    // No need for clearDraft if you don't use localStorage

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-6" />

            <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Appointment booked!
            </h1>

            <p className="text-slate-500 max-w-md mb-8">
                We’ve sent a confirmation email with your appointment details.
            </p>

            <button
                onClick={() => router.push("/")}
                className="px-8 py-3 rounded-full bg-[#009ae2] text-white font-bold shadow-md hover:opacity-90 transition"
            >
                Back to Home
            </button>
        </div>
    );
}
