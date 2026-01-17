"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';

type PatientType = 'new' | 'returning' | null;

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [patientType, setPatientType] = useState<PatientType>(null);
    const [appointmentType, setAppointmentType] = useState<string | null>(null);
    const [bookingData, setBookingData] = useState<{ dentistId: string; date: string; time: string } | null>(null);
    const [bookingFor, setBookingFor] = useState<'myself' | 'child' | 'other'>('myself');

    // Mock Dentists
    const dentists = [
        { id: '1', name: 'Dr. Alexander Buygin', specialization: 'Orthodontist', image: '/sarah_wilson.jpg' },
        { id: '2', name: 'Dr. Dan Kirky', specialization: 'Cosmetic Dentist', image: '/michael_chen.png' },
        { id: '3', name: 'Dr. F. Khani', specialization: 'Pediatric Dentist', image: '/emily_parker.jpg' }
    ];

    // Mock Date Generation (Next 4 days)
    const getNextDays = (numDays: number) => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < numDays; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                dateObj: date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), // e.g., WED
                dayNumber: date.getDate(), // e.g., 25
                fullDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` // YYYY-MM-DD (Local)
            });
        }
        return days;
    };

    const dates = getNextDays(4);

    // Mock Availability Data: { dentistId: { dateString: [times] } }
    const doctorAvailability: Record<string, Record<string, string[]>> = {
        '1': { // Dr. Sarah
            [dates[0].fullDate]: ['09:00 AM', '11:40 AM', '02:00 PM', '04:00 PM'],
            [dates[1].fullDate]: ['09:00 AM', '10:00 AM', '03:00 PM'],
            [dates[2].fullDate]: ['11:00 AM', '01:00 PM'],
            [dates[3].fullDate]: ['09:00 AM', '12:00 PM', '04:00 PM'],
        },
        '2': { // Dr. Michael
            [dates[0].fullDate]: ['10:00 AM', '12:00 PM'],
            [dates[1].fullDate]: ['09:00 AM', '11:00 AM', '02:00 PM', '05:00 PM'],
            [dates[2].fullDate]: ['09:00 AM', '10:00 AM', '11:00 AM'],
            [dates[3].fullDate]: [],
        },
        '3': { // Dr. Emily
            [dates[0].fullDate]: ['02:00 PM', '04:00 PM'],
            [dates[1].fullDate]: [],
            [dates[2].fullDate]: ['09:00 AM', '12:00 PM', '03:00 PM'],
            [dates[3].fullDate]: ['10:00 AM', '11:00 AM', '01:00 PM'],
        }
    };

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
            setBookingData(null); // Unselect if clicking the same slot
        } else {
            setBookingData({ dentistId, date, time });
        }
    };

    const handleNextStep = () => {
        if (step === 3 && bookingData) {
            setStep(4);
        }
    };

    const handleBack = () => {
        if (step === 4) {
            setStep(3);
        } else if (step === 3) {
            setStep(2);
            setAppointmentType(null);
        } else if (step === 2) {
            setStep(1);
            setPatientType(null);
        }
    };

    // Helper to get dentist details
    const selectedDentist = bookingData ? dentists.find(d => d.id === bookingData.dentistId) : null;

    const newPatientOptions = [
        "New Patient Experience",
        "New Teen Experience (6 to 12 years old)",
        "New Kids Experience (6 years and below)",
        "Emergency Appointment (Broken Tooth/ Pain)",
        "Wisdom Extraction Consultation"
    ];

    const returningPatientOptions = [
        "Existing Patient Cleaning",
        "Emergency Appointment (Broken Tooth/ Pain)",
        "Wisdom Extraction Consultation"
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-primary/20 flex flex-col">
            {/* Header */}
            <header className="grid grid-cols-3 items-center px-6 md:px-12 py-6 w-full relative z-20">
                <Link href="/" className="justify-self-start p-2 -ml-2 rounded-full hover:bg-white hover:shadow-sm text-slate-500 transition-all group flex items-center gap-2">
                    <div className="bg-white p-2 rounded-full border border-slate-200 shadow-sm group-hover:border-primary/20 group-hover:text-primary transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-slate-600 group-hover:text-slate-900 hidden md:inline">Back to Home</span>
                </Link>

                <div className="justify-self-center flex items-center gap-3 text-3xl font-bold tracking-tight text-primary">
                    <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                    <span>Dental</span>
                </div>

                <div className="justify-self-end flex items-center gap-2">
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 1 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 2 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 3 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                    <div className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${step >= 4 ? 'bg-primary' : 'bg-slate-200'}`}></div>
                </div>
            </header>

            <main className="flex-1 max-w-full mx-auto w-full px-8 md:px-12 pb-20 flex flex-col items-center justify-start pt-8">

                {step < 4 ? (
                    <div className={`w-full ${step === 3 ? 'max-w-full' : 'max-w-2xl'} bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-700`}>

                        {step === 1 && (
                            <div className="flex flex-col items-center space-y-10">
                                <div className="text-center space-y-4">
                                    <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full">Booking Phase 1/3</span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">Who are you <br />booking for?</h1>
                                </div>

                                <div className="w-full space-y-4">
                                    <button
                                        onClick={() => handlePatientTypeSelect('new')}
                                        className="w-full flex items-center justify-between p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group text-left relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">✨</div>
                                            <div>
                                                <span className="block text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">New patient</span>
                                                <span className="text-sm text-slate-400 font-medium">First time visiting us</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors shadow-sm relative z-10">
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => handlePatientTypeSelect('returning')}
                                        className="w-full flex items-center justify-between p-6 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group text-left relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4 relative z-10">
                                            <div className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">👋</div>
                                            <div>
                                                <span className="block text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">Returning patient</span>
                                                <span className="text-sm text-slate-400 font-medium">Have been here before</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-colors shadow-sm relative z-10">
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex flex-col items-center space-y-10 animate-in slide-in-from-right-8 duration-500">
                                <div className="text-center space-y-4 w-full relative">
                                    <button onClick={handleBack} className="absolute left-0 top-1 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>
                                    <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full">Booking Phase 2/3</span>
                                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight pt-2">What type of <br />appointment?</h1>
                                </div>

                                <div className="w-full space-y-3">
                                    {(patientType === 'new' ? newPatientOptions : returningPatientOptions).map((option, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAppointmentTypeSelect(option)}
                                            className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-100 bg-white hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 group text-left"
                                        >
                                            <span className="text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{option}</span>
                                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex flex-col space-y-8 animate-in slide-in-from-right-8 duration-500 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">

                                <div className="text-center pb-4 relative flex items-center justify-between">
                                    <button onClick={handleBack} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2">
                                        <ArrowLeft className="w-4 h-4" /> Back
                                    </button>

                                    <div className="flex flex-col items-center">
                                        <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] bg-primary/5 px-4 py-2 rounded-full">Final Phase 3/3</span>
                                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-4">Select a date and time</h1>
                                    </div>

                                    <button
                                        onClick={handleNextStep}
                                        disabled={!bookingData}
                                        className={`px-6 py-2 rounded-full font-bold text-white text-sm transition-all shadow-lg flex items-center gap-2 ${bookingData ? 'bg-primary hover:bg-sky-600 hover:shadow-primary/30' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
                                    >
                                        Next <Check className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                                    {/* Calendar View Container */}
                                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                                        {/* Date Header Row */}
                                        <div className="grid grid-cols-[1fr_repeat(4,1fr)] bg-slate-50 border-b border-slate-100 divide-x divide-slate-100">
                                            <div className="p-4 flex items-center justify-center text-slate-400 font-medium italic">
                                                <span className="text-xs uppercase tracking-wider">Doctor</span>
                                            </div>
                                            {dates.map((day, idx) => (
                                                <div key={idx} className="p-4 text-center">
                                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">{day.dayName}</div>
                                                    <div className="text-xl font-bold text-slate-900">{day.dayNumber}</div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Doctors Rows */}
                                        <div className="divide-y divide-slate-100">
                                            {dentists.map((dentist) => (
                                                <div key={dentist.id} className="grid grid-cols-[1fr_repeat(4,1fr)] min-h-[150px] divide-x divide-slate-100 group hover:bg-slate-50/50 transition-colors">

                                                    {/* Doctor Info Column */}
                                                    <div className="p-6 flex flex-col items-center justify-center text-center space-y-2 relative">
                                                        <div className="relative">
                                                            <img src={dentist.image} alt={dentist.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-white shadow-md group-hover:rotate-3 transition-transform duration-300" />
                                                            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 text-sm leading-tight">{dentist.name}</h3>
                                                            <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wide bg-primary/5 px-2 py-0.5 rounded-full inline-block">{dentist.specialization}</p>
                                                        </div>
                                                    </div>

                                                    {/* Availability Columns */}
                                                    {dates.map((day, idx) => {
                                                        const slots = doctorAvailability[dentist.id][day.fullDate] || [];
                                                        return (
                                                            <div key={idx} className="p-2 flex flex-col gap-2 items-center justify-start py-6">
                                                                {slots.length > 0 ? (
                                                                    slots.map((time, tIdx) => (
                                                                        <button
                                                                            key={tIdx}
                                                                            onClick={() => handleBooking(dentist.id, day.fullDate, time)}
                                                                            className={`w-full max-w-[100px] py-2 px-1 rounded-lg border text-xs font-bold transition-all shadow-sm active:scale-95 group/time ${bookingData?.dentistId === dentist.id && bookingData?.date === day.fullDate && bookingData?.time === time
                                                                                ? 'bg-primary border-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                                                                                : 'border-slate-200 bg-white text-slate-600 hover:border-primary hover:bg-primary hover:text-white'
                                                                                }`}
                                                                        >
                                                                            {time}
                                                                        </button>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-xs text-slate-300 font-medium mt-4">-</span>
                                                                )}

                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Map Container */}
                                    <div className="hidden lg:block h-full min-h-[600px] bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d995.4896822145192!2d98.74468189569045!3d3.596933230626246!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d0d6826859%3A0xd4b27636dae03e17!2sGo%20Dental%20Clinic%20(Part%20Of%20Medan%20Dental%20Center)!5e0!3m2!1sen!2sid!4v1768415380457!5m2!1sen!2sid"
                                            className="absolute inset-0 w-full h-full border-0"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>

                                    {/* Action Bar for Step 3 - Mobile/Desktop - REMOVED */}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // STEP 4: CONFIRMATION FORM
                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* LEFT COLUMN: FORM */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-10">
                                <button onClick={handleBack} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 mb-6">
                                    <ArrowLeft className="w-4 h-4" /> Back
                                </button>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Who are you booking for?</h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                                    {[
                                        { id: 'myself', label: 'Myself', icon: '👤' },
                                        { id: 'child', label: 'Child or dependent', icon: '👶' },
                                        { id: 'other', label: 'Someone else', icon: '👥' }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setBookingFor(opt.id as any)}
                                            className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2 h-24 font-bold ${bookingFor === opt.id ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700'}`}
                                        >
                                            <span className="text-2xl">{opt.icon}</span>
                                            <span className="text-sm">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-8">
                                    {/* Patient Details Section */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Patient details</h3>
                                        <p className="text-slate-500 text-sm mb-6">Please provide the following information about the person receiving care.</p>

                                        <div className="space-y-5">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">Patient first name</label>
                                                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">Patient last name</label>
                                                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">Patient legal sex</label>
                                                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium bg-white">
                                                        <option>Select...</option>
                                                        <option>Male</option>
                                                        <option>Female</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">Patient date of birth</label>
                                                    <input type="text" placeholder="DD/MM/YYYY" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">Patient zip/postal code</label>
                                                <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Parent Details Section (Conditional) */}
                                    {bookingFor === 'child' && (
                                        <div className="animate-in fade-in slide-in-from-top-4">
                                            <h3 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100">Parent/Guardian details</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">Parent first name</label>
                                                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-sm font-bold text-slate-700">Parent last name</label>
                                                    <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contact Details */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100">Contact details</h3>
                                        <div className="space-y-5">
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">Email</label>
                                                <input type="email" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">Phone number</label>
                                                <input type="tel" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                            </div>
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input type="checkbox" className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" />
                                                <span className="text-sm text-slate-500 group-hover:text-slate-700">By leaving checked, I agree to receive automated messages regarding my appointment.</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Other Details */}
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100">Other details</h3>
                                        <div className="space-y-1">
                                            <div className="flex justify-between">
                                                <label className="text-sm font-bold text-slate-700">Comments or special request</label>
                                                <span className="text-xs text-slate-400">Optional</span>
                                            </div>
                                            <textarea rows={3} className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium resize-none"></textarea>
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">By clicking "Book appointment," I agree to the <a href="#" className="underline hover:text-primary">Terms</a> and <a href="#" className="underline hover:text-primary">Privacy Policy</a>.</p>
                                        <button className="w-full md:w-auto px-8 py-4 bg-primary hover:bg-sky-600 text-white font-bold rounded-xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                                            Book appointment
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: SUMMARY CARD */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sticky top-24">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Appointment details</h3>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <Check className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm mb-1">{appointmentType}</p>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                {bookingData && new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {bookingData?.time}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm mb-1">AntriGigi Dental</p>
                                            <p className="text-slate-500 text-sm leading-relaxed">
                                                Jl. Bantaran Sungai, Hutan, Kec. Percut Sei Tuan, Kabupaten Deli Serdang
                                            </p>
                                        </div>
                                    </div>

                                    {selectedDentist && (
                                        <div className="flex gap-4 pt-6 border-t border-slate-100">
                                            <img src={selectedDentist.image} className="w-10 h-10 rounded-full object-cover" alt={selectedDentist.name} />
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm mb-0">{selectedDentist.name}</p>
                                                <p className="text-slate-500 text-xs">{selectedDentist.specialization}</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {
                    step < 4 && (
                        <div className="mt-12 text-center animate-in fade-in duration-1000 delay-300">
                            <p className="text-sm text-slate-400 flex items-center justify-center gap-2 font-medium">
                                <Check className="w-4 h-4 text-green-500" /> Instant booking secured with <span className="text-slate-600 font-bold">AntriGigi Secure</span>
                            </p>
                        </div>
                    )
                }

            </main>
        </div >
    );
}
