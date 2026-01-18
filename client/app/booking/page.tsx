"use client";

import { useState, useEffect, useMemo } from "react";
import { User, UserPlus, Check, ArrowLeft, ChevronRight, ChevronLeft, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { getAllDoctors } from "@/actions/doctor";

// --- Types ---
type PatientType = 'new' | 'returning' | null;

interface Doctor {
    id: string;
    name: string;
    specialization: string;
    image: string;
    availability: any;
}

interface DateInfo {
    dayName: string;
    dayNumber: number;
    monthName: string;
    fullDate: string;
}

interface BookingSelection {
    dentistId: string;
    date: string;
    time: string;
}

type BookingForType = 'myself' | 'child' | 'other';

// --- Constants ---
const NEW_PATIENT_OPTIONS = [
    "New Patient Experience",
    "New Teen Experience (6 to 12 years old)",
    "New Child Experience (Under 6 years old)",
    "Consultation (Problem Focused)",
];

const RETURNING_PATIENT_OPTIONS = [
    "Hygiene (Cleaning)",
    "Whitening",
    "Clear Aligner Consult",
    "Consultation (Problem Focused)",
];

export default function BookingPage() {
    // --- State ---
    const [step, setStep] = useState<number>(1);
    const [patientType, setPatientType] = useState<PatientType>(null);
    const [appointmentType, setAppointmentType] = useState<string | null>(null);
    const [bookingFor, setBookingFor] = useState<string>('Myself');

    const [dentists, setDentists] = useState<Doctor[]>([]);
    const [doctorAvailability, setDoctorAvailability] = useState<Record<string, Record<string, string[]>>>({});
    const [dates, setDates] = useState<DateInfo[]>([]);

    const [dateOffset, setDateOffset] = useState<number>(0);
    const [mobileDateIdx, setMobileDateIdx] = useState<number>(0);
    const [bookingData, setBookingData] = useState<BookingSelection | null>(null);

    // --- Effects ---
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const result = await getAllDoctors();
                if (result.success && result.data) {
                    const mappedDoctors: Doctor[] = result.data.map((doc: any) => ({
                        id: doc.id,
                        name: doc.name,
                        specialization: doc.specialization,
                        image: doc.image,
                        availability: doc.availability ? JSON.parse(doc.availability as string) : {}
                    }));
                    setDentists(mappedDoctors);

                    const availabilityMap: Record<string, Record<string, string[]>> = {};
                    mappedDoctors.forEach((doc) => {
                        availabilityMap[doc.id] = doc.availability;
                    });
                    setDoctorAvailability(availabilityMap);
                }
            } catch (error) {
                console.error("Failed to fetch doctors", error);
            }
        };
        fetchDoctors();
    }, []);

    useEffect(() => {
        const createDates = () => {
            const arr: DateInfo[] = [];
            const today = new Date();
            for (let i = 0; i < 14; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() + i);
                arr.push({
                    dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
                    dayNumber: date.getDate(),
                    monthName: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
                    fullDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                });
            }
            return arr;
        };
        setDates(createDates());
    }, []);

    // --- Computed ---
    const visibleDates = dates.length > 0 ? dates.slice(dateOffset, dateOffset + 4) : [];

    // Explicit useMemo here serves as a test that syntax is fine
    const selectedDentist = useMemo(() => {
        if (!bookingData) return null;
        return dentists.find(d => d.id === bookingData.dentistId) || null;
    }, [bookingData, dentists]);

    // --- Handlers ---
    const handlePatientTypeSelect = (type: PatientType) => {
        setPatientType(type);
        setStep(2);
    };

    const handleAppointmentTypeSelect = (type: string) => {
        setAppointmentType(type);
        setStep(3);
    };

    const handleBooking = (dentistId: string, date: string, time: string) => {
        if (bookingData?.dentistId === dentistId && bookingData?.date === date && bookingData?.time === time) {
            setBookingData(null);
        } else {
            setBookingData({ dentistId, date, time });
        }
    };

    const handleNextStep = () => {
        if (step === 3 && bookingData) setStep(4);
    };

    const handlePrevDates = () => {
        setDateOffset(prev => Math.max(0, prev - 4));
    };

    const handleNextDates = () => {
        setDateOffset(prev => Math.min(dates.length - 4, prev + 4));
    };

    const router = useRouter(); // Initialize router

    const handleBack = () => {
        if (step === 4) setStep(3);
        else if (step === 3) { setStep(2); setAppointmentType(null); }
        else if (step === 2) { setStep(1); setPatientType(null); }
        else if (step === 1) router.push('/');
    };

    // --- Render Helpers ---

    const renderHeader = () => (
        <nav className="w-full max-w-[95%] h-24 flex items-center justify-between relative mx-auto">
            {/* Left: Back Button - Pushed to edge (ALWAYS Back to Home) */}
            <div className="z-10 flex-shrink-0">
                <button onClick={() => router.push('/')} className="flex items-center gap-3 text-slate-400 font-bold hover:text-slate-800 transition-colors group">
                    <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm group-hover:border-slate-300 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="hidden md:inline text-sm">Back to Home</span>
                </button>
            </div>

            {/* Center: Logo - Absolutely centered */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
                <img
                    src="/resources/clean.png"
                    alt="Dental Logo"
                    className="h-10 w-auto object-contain"
                    style={{ filter: 'invert(49%) sepia(38%) saturate(3015%) hue-rotate(175deg) brightness(96%) contrast(101%)' }}
                />
                <span className="text-3xl font-bold tracking-tight text-[#009ae2]">Dental</span>
            </div>

            {/* Right: Dots - Pushed to edge */}
            <div className="z-10 flex gap-3 flex-shrink-0">
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#009ae2] scale-110' : 'bg-slate-200'}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#009ae2] scale-110' : 'bg-slate-200'}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#009ae2] scale-110' : 'bg-slate-200'}`}></div>
                <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            </div>
        </nav>
    );

    const renderStep1 = () => (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-xl shadow-slate-200/40 text-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-[#009ae2] text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                    BOOKING PHASE 1/3
                </span>

                <h1 className="text-4xl font-bold text-slate-900 mb-2">Who are you</h1>
                <h1 className="text-4xl font-bold text-slate-900 mb-12">booking for?</h1>

                <div className="space-y-4">
                    <button
                        onClick={() => handlePatientTypeSelect('new')}
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
                        onClick={() => handlePatientTypeSelect('returning')}
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

    const renderStep2 = () => (
        <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in slide-in-from-right-8 duration-500">
            <div className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-xl shadow-slate-200/40 text-center relative">
                <div className="absolute left-8 top-8">
                    <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-bold transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
                <span className="inline-block px-4 py-1.5 rounded-full bg-sky-50 text-[#009ae2] text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                    BOOKING PHASE 2/3
                </span>

                <h1 className="text-3xl font-bold text-slate-900 mb-2">What type of</h1>
                <h1 className="text-3xl font-bold text-slate-900 mb-10">appointment?</h1>

                <div className="space-y-4">
                    {['New Patient Experience', 'New Teen Experience (6 to 12 years old)', 'New Child Experience (Under 6 years old)', 'Consultation (Problem Focused)'].map((type) => (
                        <button
                            key={type}
                            onClick={() => handleAppointmentTypeSelect(type)}
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

    const renderStep3 = () => (
        <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Phase Back Button - Above Card */}


            <div className="bg-white rounded-[3rem] p-8 w-full max-w-[95%] shadow-xl shadow-slate-200/40 border border-slate-50 relative">

                {/* Header */}
                <div className="flex flex-col items-center justify-center mb-8 relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <button onClick={handleBack} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                            <span className="hidden md:inline">Back</span>
                        </button>
                    </div>
                    {/* Back button removed from here */}

                    <span className="px-4 py-1.5 rounded-full bg-sky-50 text-[#009ae2] text-[11px] font-bold tracking-[0.2em] uppercase mb-3">
                        FINAL PHASE 3/3
                    </span>
                    <h1 className="text-3xl font-bold text-slate-900">Select Date & Time</h1>

                    {/* Navigation Button */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <button
                            disabled={!bookingData}
                            onClick={() => setStep(4)}
                            className={`flex items-center gap-2 font-bold px-6 py-2 rounded-full transition-all ${bookingData ? 'bg-[#009ae2] text-white shadow-md shadow-blue-200 hover:scale-105' : 'bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                        >
                            <span>Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[2.5fr_1fr] gap-8 flex-1 min-h-0">
                    {/* Schedule Section */}
                    <div className="bg-slate-50/50 rounded-[2rem] border border-slate-100 overflow-hidden h-full flex flex-col">

                        {/* Desktop Grid Header with Navigation */}
                        <div className="hidden md:grid grid-cols-[1.2fr_repeat(4,1fr)] border-b border-slate-100 bg-slate-50 flex-none relative">
                            {/* Nav Buttons Overlay */}
                            <div className="absolute inset-y-0 right-0 w-[80%] pointer-events-none flex justify-between items-center px-2">
                                <button
                                    onClick={handlePrevDates}
                                    disabled={dateOffset === 0}
                                    className={`pointer-events-auto p-2 rounded-full hover:bg-slate-200 transition-colors z-20 ${dateOffset === 0 ? 'opacity-0' : 'text-slate-500'}`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleNextDates}
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

                        {/* Doctor Rows */}
                        <div className="divide-y divide-slate-100 bg-white">
                            {dentists.map((dentist) => (
                                <div key={dentist.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_repeat(4,1fr)] h-[300px] group hover:bg-slate-50/30 transition-colors">
                                    <div className="p-6 flex flex-col items-center justify-start text-center pt-8">
                                        <div className="relative mb-3">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border border-white bg-slate-100">
                                                <img src={dentist.image} alt={dentist.name} className={`w-full h-full object-cover ${dentist.id === '2' ? 'scale-[1.6] object-top translate-y-2' : ''}`} />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                                        </div>
                                        <h3 className="text-xs font-bold text-slate-900 leading-tight mb-1">{dentist.name}</h3>
                                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-wide">{dentist.specialization}</p>
                                    </div>

                                    {/* Time Slots */}
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
                                                                onClick={() => handleBooking(dentist.id, day.fullDate, time)}
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

                                    {/* Mobile Date/Time Fallback */}
                                    <div className="md:hidden p-4 text-center border-t border-slate-50">
                                        <span className="text-xs text-slate-400">Desktop view only</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Map - Scaled to fill */}
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

    const renderStep4 = () => {
        const selectedDoc = dentists.find(d => d.id === bookingData?.dentistId);

        return (
            <div className="w-full max-w-7xl mx-auto animate-in slide-in-from-right-8 duration-500 pb-20 pt-10">
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* LEFT COLUMN: FORM */}
                    <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 w-full">
                        <button onClick={handleBack} className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-bold mb-8 transition-colors">
                            <ArrowLeft className="w-4 h-4" /> Back
                        </button>

                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Who are you booking for?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                            {['Myself', 'Child or dependent', 'Someone else'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setBookingFor(opt as BookingForType)}
                                    className={`py-4 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2
                                ${bookingFor === opt
                                            ? 'border-[#009ae2] bg-blue-50/50 text-[#009ae2] shadow-sm'
                                            : 'border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="text-2xl">
                                        {opt === 'Myself' ? <User className="w-6 h-6" /> :
                                            opt === 'Child or dependent' ? <UserPlus className="w-6 h-6" /> :
                                                <UserPlus className="w-6 h-6" />}
                                    </div>
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {/* Patient Details */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient details</h2>
                            <p className="text-slate-500 text-sm mb-6">Please provide the following information about the person receiving care.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your first name</label>
                                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your last name</label>
                                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your legal sex</label>
                                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium bg-white text-slate-600">
                                        <option>Select...</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Your date of birth</label>
                                    <input
                                        type="date"
                                        max={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium text-slate-600"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Your zip/postal code</label>
                                <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium" />
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact details</h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email</label>
                                    <input type="email" className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Phone number</label>
                                    <input type="tel" className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium" />
                                </div>
                                <div className="flex items-start gap-3">
                                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-slate-300 text-[#009ae2] focus:ring-[#009ae2]" />
                                    <span className="text-xs text-slate-500">By leaving checked, I agree with the <a href="#" className="text-[#009ae2] underline">Calling Consent</a>.</span>
                                </div>
                            </div>
                        </div>

                        {/* Other Details */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-bold text-slate-900">Other details</h2>
                                <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Optional</span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Comments or special request</label>
                                <textarea rows={4} className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium resize-none"></textarea>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-6 border-t border-slate-100">
                            <button
                                onClick={() => router.push('/success')}
                                className="w-full md:w-auto px-10 py-4 bg-[#009ae2] hover:opacity-90 text-white font-bold rounded-full shadow-lg shadow-[#009ae2]/40 transition-all text-lg"
                            >
                                Book appointment
                            </button>
                            <p className="text-[10px] text-slate-400 mt-4 leading-relaxed max-w-2xl">
                                By clicking "Book appointment," I agree to the <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>. I consent for myself and others to receive automated messages.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SUMMARY SIDEBAR */}
                    <div className="w-full lg:w-[400px] flex-shrink-0">
                        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-6">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Appointment details</h3>

                            <div className="space-y-6">
                                {/* Selected Service & Time */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{appointmentType || 'Consultation'}</div>
                                        <div className="text-slate-500 text-sm mt-1">
                                            {bookingData?.date ? new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'Date not selected'}
                                            <br />
                                            at {bookingData?.time || 'Time not selected'}
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">Go Dental Clinic</div>
                                        <div className="text-slate-500 text-sm mt-1 leading-relaxed">
                                            Jl. Bantaran Sungai, Hutan, Kec. Percut Sei Tuan, Deli Serdang, Sumatera Utara
                                        </div>
                                    </div>
                                </div>

                                {/* Doctor */}
                                {selectedDoc && (
                                    <div className="flex gap-4 pt-6 border-t border-slate-50">
                                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-100">
                                            <img src={selectedDoc.image} alt={selectedDoc.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 text-sm">{selectedDoc.name}</div>
                                            <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mt-0.5">{selectedDoc.specialization}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    // --- Main Render ---
    let content = null;
    if (step === 1) content = renderStep1();
    else if (step === 2) content = renderStep2();
    else if (step === 3) content = renderStep3();
    else if (step === 4) content = renderStep4();

    return (
        <div className="min-h-screen bg-slate-50/[0.3] font-sans selection:bg-blue-100">
            {renderHeader()}

            <main className="w-full px-4 md:px-6 py-6 pb-20">
                {content}

                {step < 3 && (
                    <div className="mt-12 text-center animate-in fade-in duration-1000 delay-300">
                        <p className="text-xs text-slate-400 flex items-center justify-center gap-2 font-medium">
                            <Check className="w-3 h-3 text-green-500" /> Instant booking secured with <span className="text-slate-600 font-bold">AntriGigi Secure</span>
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
