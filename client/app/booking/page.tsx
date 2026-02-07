"use client";

import { useState, useEffect, useMemo } from "react";
import { Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllDoctors } from "@/actions/doctor";
import { Doctor, DateInfo, BookingSelection, PatientType, BookingForType } from "@/lib/types";

import BookingHeader from "./components/BookingHeader";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";

export default function BookingPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [step, setStep] = useState<number>(1);
    const [patientType, setPatientType] = useState<PatientType>('new');
    const [appointmentType, setAppointmentType] = useState<string | null>(null);
    const [bookingFor, setBookingFor] = useState<BookingForType>('Myself');

    const [dentists, setDentists] = useState<Doctor[]>([]);
    const [doctorAvailability, setDoctorAvailability] = useState<Record<string, Record<string, string[]>>>({});
    const [dates, setDates] = useState<DateInfo[]>([]);

    const [dateOffset, setDateOffset] = useState<number>(0);
    const [bookingData, setBookingData] = useState<BookingSelection | null>(null);
    const [userID, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const stepParam = searchParams.get("step");
        if (stepParam) setStep(Number(stepParam));
    }, [searchParams]);

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

    const selectedDoc = useMemo(() => {
        if (!bookingData) return null;
        return dentists.find(d => d.id === bookingData.dentistId) || null;
    }, [bookingData, dentists]);

    const handleBack = () => {
        if (step === 4) setStep(3);
        else if (step === 3) { setStep(2); setAppointmentType(null); }
        else if (step === 2) { setStep(1); }
        else if (step === 1) router.push('/');
    };

    const handlePatientTypeSelect = (type: PatientType) => {
        if (type === "returning") {
            router.push("/login?redirect=/booking");
            return;
        }
        setPatientType(type);
        setStep(2);
    };

    const handleAppointmentTypeSelect = async (type: string) => {
        setAppointmentType(type);
        try {
            await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientType,
                    appointmentType: type,
                    userID,
                }),
            });
        } catch (error) {
            console.error("Failed to save booking", error);
        }
        setStep(3);
    };

    const handleBookingSelect = (dentistId: string, date: string, time: string) => {
        if (
            bookingData?.dentistId === dentistId &&
            bookingData?.date === date &&
            bookingData?.time === time
        ) {
            setBookingData(null);
        } else {
            setBookingData({ dentistId, date, time });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/[0.3] font-sans selection:bg-blue-100">
            <BookingHeader step={step} />

            <main className="w-full px-4 md:px-6 py-6 pb-20">
                {step === 1 && <Step1 onSelect={handlePatientTypeSelect} />}

                {step === 2 && (
                    <Step2
                        patientType={patientType}
                        onSelect={handleAppointmentTypeSelect}
                        onBack={handleBack}
                    />
                )}

                {step === 3 && (
                    <Step3
                        bookingData={bookingData}
                        dentists={dentists}
                        dates={dates}
                        dateOffset={dateOffset}
                        doctorAvailability={doctorAvailability}
                        onBooking={handleBookingSelect}
                        onBack={handleBack}
                        onNext={() => setStep(4)}
                        onPrevDates={() => setDateOffset(prev => Math.max(0, prev - 4))}
                        onNextDates={() => setDateOffset(prev => Math.min(dates.length - 4, prev + 4))}
                    />
                )}

                {step === 4 && (
                    <Step4
                        bookingData={bookingData}
                        selectedDoc={selectedDoc}
                        appointmentType={appointmentType}
                        bookingFor={bookingFor}
                        patientType={patientType}
                        onBack={handleBack}
                        onSetBookingFor={setBookingFor}
                        onComplete={() => router.push("/success")}
                    />
                )}

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
