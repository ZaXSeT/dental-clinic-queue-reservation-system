"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar as CalendarIcon, Clock, ChevronRight, Check } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";


const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30",
    "11:00", "11:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30"
];

import { io, Socket } from "socket.io-client";
let socket: Socket;

export default function BookingPage() {
    const searchParams = useSearchParams();
    const preSelectedDentist = searchParams.get("dentist");

    const [step, setStep] = useState(1);
    const [selectedDentist, setSelectedDentist] = useState<string | null>(preSelectedDentist);
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<string>("");

    
    const [lockedSlots, setLockedSlots] = useState<string[]>([]);

    useEffect(() => {
        
        console.log("Connecting to WebSocket...");
        
    }, []);

    const handleBooking = async () => {
        
        alert(`Booked ${selectedDentist} on ${selectedDate} at ${selectedTime}`);
    };

    return (
        <main className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <Link href="/" className="text-slate-500 hover:text-primary mb-4 inline-block font-medium">
                        &larr; Cancel
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-900">Book Appointment</h1>
                    <div className="flex items-center gap-2 mt-4 text-sm font-medium text-slate-400">
                        <span className={clsx(step >= 1 && "text-primary")}>1. Dentist</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className={clsx(step >= 2 && "text-primary")}>2. Date & Time</span>
                        <ChevronRight className="h-4 w-4" />
                        <span className={clsx(step >= 3 && "text-primary")}>3. Confirm</span>
                    </div>
                </header>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
                    {}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 text-slate-900">
                                <Check className="bg-primary text-white rounded-full p-1 h-6 w-6" /> Select Specialist
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: '1', name: 'Dr. Sarah Wilson', specialization: 'Orthodontist', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2' },
                                    { id: '2', name: 'Dr. Michael Chen', specialization: 'Cosmetic Dentist', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d' },
                                    { id: '3', name: 'Dr. Emily Rose', specialization: 'Pediatric Dentist', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f' }
                                ].map(dentist => (
                                    <button
                                        key={dentist.id}
                                        onClick={() => { setSelectedDentist(dentist.name); setStep(2); }}
                                        className={clsx(
                                            "p-4 rounded-xl border text-left transition-all hover:border-primary flex items-center gap-4",
                                            selectedDentist === dentist.name ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-slate-200 bg-slate-50 hover:bg-white"
                                        )}
                                    >
                                        <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200 flex-shrink-0">
                                            <img src={dentist.image} alt={dentist.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{dentist.name}</div>
                                            <div className="text-sm text-slate-500">{dentist.specialization}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {}
                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
                                    <CalendarIcon className="h-5 w-5 text-primary" /> Select Date
                                </h2>
                                <input
                                    type="date"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-primary outline-none"
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            {selectedDate && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-slate-900">
                                        <Clock className="h-5 w-5 text-primary" /> Select Time
                                    </h2>
                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                        {TIME_SLOTS.map(time => (
                                            <button
                                                key={time}
                                                disabled={lockedSlots.includes(time)}
                                                onClick={() => setSelectedTime(time)}
                                                className={clsx(
                                                    "py-2 px-4 rounded-lg font-medium transition-colors border",
                                                    selectedTime === time
                                                        ? "bg-primary text-white border-primary"
                                                        : lockedSlots.includes(time)
                                                            ? "bg-red-50 text-red-400 cursor-not-allowed border-red-100"
                                                            : "bg-white border-slate-200 hover:border-primary text-slate-600"
                                                )}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 mt-8">
                                <button onClick={() => setStep(1)} className="px-6 py-2 text-slate-500 hover:text-slate-900">Back</button>
                                <button
                                    disabled={!selectedTime || !selectedDate}
                                    onClick={() => setStep(3)}
                                    className="px-6 py-2 bg-primary text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-sky-600 transition-colors shadow-lg shadow-primary/20"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {}
                    {step === 3 && (
                        <div className="text-center py-10 animate-in zoom-in-95">
                            <h2 className="text-2xl font-bold mb-4 text-slate-900">Confirm Appointment</h2>
                            <div className="bg-slate-50 p-6 rounded-xl inline-block text-left mb-8 border border-slate-200 max-w-sm w-full shadow-sm">
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-500">Dentist</span>
                                    <span className="font-bold text-slate-900">{selectedDentist}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-slate-500">Date</span>
                                    <span className="font-bold text-slate-900">{selectedDate}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Time</span>
                                    <span className="font-bold text-primary">{selectedTime}</span>
                                </div>
                            </div>

                            <div className="flex justify-center gap-4">
                                <button onClick={() => setStep(2)} className="px-6 py-2 text-slate-500 hover:text-slate-900">Back</button>
                                <button
                                    onClick={handleBooking}
                                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/20 transition-all"
                                >
                                    Confirm Booking
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
