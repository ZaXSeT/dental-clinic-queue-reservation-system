"use client";

import { getAllDoctors } from '@/actions/doctor';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Check } from 'lucide-react';

type PatientType = 'new' | 'returning' | null;

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [patientType, setPatientType] = useState<PatientType>(null);
    const [appointmentType, setAppointmentType] = useState<string | null>(null);
    const [bookingData, setBookingData] = useState<{ dentistId: string; date: string; time: string } | null>(null);
    const [bookingFor, setBookingFor] = useState<'myself' | 'child' | 'other'>('myself');
    const [mobileDateIdx, setMobileDateIdx] = useState(0);

    const [dentists, setDentists] = useState<any[]>([]);
    const [doctorAvailability, setDoctorAvailability] = useState<Record<string, Record<string, string[]>>>({});

    useEffect(() => {
        const loadDoctors = async () => {
            const { data } = await getAllDoctors();
            if (data) {
                setDentists(data);

                // Parse availability
                const availMap: Record<string, any> = {};
                data.forEach((doc: any) => {
                    try {
                        availMap[doc.id] = doc.availability ? JSON.parse(doc.availability) : {};
                    } catch (e) {
                        availMap[doc.id] = {};
                    }
                });
                setDoctorAvailability(availMap);
            }
        };
        loadDoctors();
    }, []);

    const getNextDays = (numDays: number) => {
        const days = [];
        const today = new Date();
        for (let i = 0; i < numDays; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                dateObj: date,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(), // MON, TUE...
                dayNumber: date.getDate(),
                fullDate: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
            });
        }
        return days;
    };

    const dates = getNextDays(14); // Extended to 2 weeks for better testing

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

                                <div className="text-center pb-2 md:pb-4 relative flex items-center justify-between gap-2 md:gap-4">
                                    <button onClick={handleBack} className="text-xs md:text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1 md:gap-2">
                                        <ArrowLeft className="w-4 h-4" /> <span className="hidden xs:inline">Back</span>
                                    </button>

                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-primary font-bold text-[10px] md:text-xs uppercase tracking-[0.2em] bg-primary/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full whitespace-nowrap">Final Phase 3/3</span>
                                        <h1 className="text-lg md:text-3xl font-bold text-slate-900 tracking-tight mt-2 md:mt-4 leading-tight">Select Date & Time</h1>
                                    </div>

                                    <button
                                        onClick={handleNextStep}
                                        disabled={!bookingData}
                                        className={`px-4 py-2 md:px-6 md:py-2 rounded-full font-bold text-white text-xs md:text-sm transition-all shadow-lg flex items-center gap-2 ${bookingData ? 'bg-primary hover:bg-sky-600 hover:shadow-primary/30' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
                                    >
                                        Next <Check className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">

                                    <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

                                        <div className="md:hidden flex flex-col h-full bg-slate-50/50">

                                            <div className="flex overflow-x-auto py-4 px-4 gap-3 snap-x no-scrollbar bg-white border-b border-slate-100 sticky top-0 z-10">
                                                {dates.map((day, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setMobileDateIdx(idx)}
                                                        className={`flex-shrink-0 snap-center flex flex-col items-center justify-center w-20 h-24 rounded-2xl border-2 transition-all duration-300 ${mobileDateIdx === idx
                                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                                            }`}
                                                    >
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{day.dayName}</span>
                                                        <span className="text-2xl font-black mt-1">{day.dayNumber}</span>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="flex flex-col gap-4 p-4">
                                                {dentists.map((dentist) => {
                                                    const selectedDate = dates[mobileDateIdx];
                                                    const slots = doctorAvailability[dentist.id]?.[selectedDate.dayName] || [];

                                                    return (
                                                        <div key={dentist.id} className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm">
                                                            <div className="flex items-center gap-4 mb-5 border-b border-slate-50 pb-4">
                                                                <div className="relative">
                                                                    <div className={`h-14 w-14 rounded-2xl overflow-hidden ${dentist.id === '2' ? 'shadow-sm' : ''}`}>
                                                                        <img
                                                                            src={dentist.image}
                                                                            alt={dentist.name}
                                                                            className={`h-full w-full object-cover ${dentist.id === '2' ? 'scale-[1.7] object-top translate-y-3.5' : ''}`}
                                                                        />
                                                                    </div>
                                                                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                                                </div>
                                                                <div>
                                                                    <h3 className="font-bold text-slate-900 leading-tight">{dentist.name}</h3>
                                                                    <p className="text-xs text-primary font-bold uppercase tracking-wider mt-1">{dentist.specialization}</p>
                                                                </div>
                                                            </div>

                                                            <div>
                                                                {slots.length > 0 ? (
                                                                    <div className="grid grid-cols-3 gap-2">
                                                                        {slots.map((time, tIdx) => (
                                                                            <button
                                                                                key={tIdx}
                                                                                onClick={() => handleBooking(dentist.id, selectedDate.fullDate, time)}
                                                                                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border-2 ${bookingData?.dentistId === dentist.id && bookingData?.date === selectedDate.fullDate && bookingData?.time === time
                                                                                    ? 'bg-primary border-primary text-white shadow-md'
                                                                                    : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-200'
                                                                                    }`}
                                                                            >
                                                                                {time}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                                                        <span className="text-xs text-slate-400 font-medium">No slots available</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="hidden md:block">

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

                                            <div className="divide-y divide-slate-100">
                                                {dentists.map((dentist) => (
                                                    <div key={dentist.id} className="grid grid-cols-[1fr_repeat(4,1fr)] min-h-[150px] divide-x divide-slate-100 group hover:bg-slate-50/50 transition-colors">

                                                        <div className="p-6 flex flex-col items-center justify-center text-center space-y-2 relative">
                                                            <div className="relative group-hover:rotate-3 transition-transform duration-300">
                                                                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                                                                    <img
                                                                        src={dentist.image}
                                                                        alt={dentist.name}
                                                                        className={`h-full w-full object-cover transition-transform duration-300 ${dentist.id === '2' ? 'scale-[1.7] object-top translate-y-3.5' : ''}`}
                                                                    />
                                                                </div>
                                                                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white z-10"></div>
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-slate-900 text-sm leading-tight">{dentist.name}</h3>
                                                                <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wide bg-primary/5 px-2 py-0.5 rounded-full inline-block">{dentist.specialization}</p>
                                                            </div>
                                                        </div>

                                                        {dates.map((day, idx) => {
                                                            const slots = doctorAvailability[dentist.id]?.[day.dayName] || [];
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
                                    </div>

                                    <div className="block lg:block h-[300px] lg:h-full lg:min-h-[600px] bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d995.4896822145192!2d98.74468189569045!3d3.596933230626246!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x303131d0d6826859%3A0xd4b27636dae03e17!2sGo%20Dental%20Clinic%20(Part%20Of%20Medan%20Dental%20Center)!5e0!3m2!1sen!2sid!4v1768415380457!5m2!1sen!2sid"
                                            className="absolute inset-0 w-full h-full border-0"
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                ) : (

                    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

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
                                                    <input type="date" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium cursor-pointer text-slate-600" />
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-sm font-bold text-slate-700">Patient zip/postal code</label>
                                                <input type="text" className="w-full p-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-medium" />
                                            </div>
                                        </div>
                                    </div>

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
