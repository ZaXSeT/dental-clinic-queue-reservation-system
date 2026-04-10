"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, UserPlus, Calendar, MapPin } from "lucide-react";
import { BookingSelection, Doctor, BookingForType, PatientType } from "@/lib/types";

interface Step4Props {
    bookingData: BookingSelection | null;
    selectedDoc: Doctor | null;
    appointmentType: string | null;
    bookingFor: BookingForType;
    patientType: PatientType;
    onBack: () => void;
    onSetBookingFor: (type: BookingForType) => void;
    onComplete: (data: { doctor: string; date: string; time: string; treatment: string; name: string }) => void;
}

export default function Step4({
    bookingData,
    selectedDoc,
    appointmentType,
    bookingFor,
    patientType,
    onBack,
    onSetBookingFor,
    onComplete,
}: Step4Props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [legalSex, setLegalSex] = useState<"Male" | "Female">("Male");
    const [birthDate, setBirthDate] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEmailLocked, setIsEmailLocked] = useState(false);

    // Auto-fill logged-in patient details
    useEffect(() => {
        fetch('/api/patient/me')
            .then(res => res.json())
            .then(data => {
                if (data.loggedIn && data.email) {
                    setEmail(data.email);
                    setIsEmailLocked(true);
                    
                    if (data.name) {
                        const parts = data.name.trim().split(" ");
                        setFirstName(parts[0] || "");
                        setLastName(parts.slice(1).join(" ") || "");
                    }
                }
            })
            .catch(() => {});
    }, []);

    const [gFirstName, setGFirstName] = useState("");
    const [gLastName, setGLastName] = useState("");
    const [gLegalSex, setGLegalSex] = useState<"Male" | "Female">("Male");
    const [gBirthDate, setGBirthDate] = useState("");

    const handleSubmit = async () => {
        if (!bookingData || !selectedDoc) return;

        const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{8,15}$/;
        const zipRegex = /^[0-9]{4,10}$/; 

        if (!firstName || !lastName || !email || !phone || !birthDate || !zipCode) {
            setError("Please fill in all required fields in Patient Details.");
            return;
        }

        if (!nameRegex.test(firstName.trim())) {
            setError("Please enter a valid first name (letters only, min 2 characters).");
            return;
        }
        if (!nameRegex.test(lastName.trim())) {
            setError("Please enter a valid last name (letters only, min 2 characters).");
            return;
        }
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }
        if (!phoneRegex.test(phone.trim())) {
            setError("Please enter a valid phone number.");
            return;
        }
        if (!zipRegex.test(zipCode.trim())) {
            setError("Please enter a valid zip/postal code.");
            return;
        }
        if (comments && comments.length > 300) {
            setError("Comments must not exceed 300 characters.");
            return;
        }

        if (bookingFor === "Child or dependent") {
            if (!gFirstName || !gLastName || !gBirthDate) {
                setError("Please fill in all required fields in Parent/Guardian Details.");
                return;
            }
            if (!nameRegex.test(gFirstName.trim())) {
                setError("Please enter a valid guardian first name.");
                return;
            }
            if (!nameRegex.test(gLastName.trim())) {
                setError("Please enter a valid guardian last name.");
                return;
            }
        }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientType,
                    bookingFor,
                    patientInfo: {
                        firstName,
                        lastName,
                        name: `${firstName} ${lastName}`,
                        birthDate,
                        legalSex,
                        zipCode,
                        email,
                        phone,
                        guardian: bookingFor === "Child or dependent" ? {
                            firstName: gFirstName,
                            lastName: gLastName,
                            legalSex: gLegalSex,
                            birthDate: gBirthDate
                        } : null
                    },
                    comments,
                    dentistName: selectedDoc.name,
                    date: bookingData.date,
                    time: bookingData.time,
                    treatment: appointmentType || "Consultation",
                    notes: comments,
                }),
            });

            const data = await res.json();
            if (data.success) {
                onComplete({
                    doctor: selectedDoc.name,
                    date: bookingData.date,
                    time: bookingData.time,
                    treatment: appointmentType || "Consultation",
                    name: `${firstName} ${lastName}`,
                });
            } else {
                setError(data.error || "Failed to book appointment. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Failed to book appointment:", err);
            setError("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto animate-in slide-in-from-right-8 duration-500 pb-20 pt-10">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                
                <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 w-full">
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-bold mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>

                    <h2 className="text-2xl font-bold text-slate-900 mb-6">Who are you booking for?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {(["Myself", "Child or dependent", "Someone else"] as BookingForType[]).map((opt) => (
                            <button
                                key={opt}
                                onClick={() => onSetBookingFor(opt)}
                                className={`py-4 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2
                                ${bookingFor === opt
                                        ? "border-[#009ae2] bg-blue-50/50 text-[#009ae2] shadow-sm"
                                        : "border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div className="text-2xl">
                                    {opt === "Myself" ? <User className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                                </div>
                                {opt}
                            </button>
                        ))}
                    </div>

                    
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient details</h2>
                        <p className="text-slate-500 text-sm mb-6">
                            Please provide the following information about the person receiving care.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">First name <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    maxLength={50}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="e.g. John"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Last name <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    maxLength={50}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="e.g. Doe"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Legal sex</label>
                                <select
                                    value={legalSex}
                                    onChange={(e) => setLegalSex(e.target.value as "Male" | "Female")}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium bg-white text-slate-600"
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Date of birth <span className="text-red-400">*</span></label>
                                <input
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium text-slate-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Zip/postal code <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                maxLength={10}
                                value={zipCode}
                                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
                                placeholder="e.g. 20351"
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                            />
                        </div>
                    </div>

                    
                    {bookingFor === "Child or dependent" && (
                        <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Parent/Guardian details</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian first name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        maxLength={50}
                                        value={gFirstName}
                                        onChange={(e) => setGFirstName(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian last name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        maxLength={50}
                                        value={gLastName}
                                        onChange={(e) => setGLastName(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian legal sex</label>
                                    <select
                                        value={gLegalSex}
                                        onChange={(e) => setGLegalSex(e.target.value as "Male" | "Female")}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium bg-white text-slate-600"
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian date of birth <span className="text-red-400">*</span></label>
                                    <input
                                        type="date"
                                        max={new Date().toISOString().split("T")[0]}
                                        value={gBirthDate}
                                        onChange={(e) => setGBirthDate(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium text-slate-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact details</h2>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Email <span className="text-red-400">*</span></label>
                                <input
                                    type="email"
                                    maxLength={100}
                                    value={email}
                                    readOnly={isEmailLocked}
                                    onChange={(e) => !isEmailLocked && setEmail(e.target.value)}
                                    placeholder="e.g. john@email.com"
                                    className={`w-full p-3 rounded-xl border border-slate-200 outline-none transition-all font-medium ${isEmailLocked ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2]'}`}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Phone number <span className="text-red-400">*</span></label>
                                <input
                                    type="tel"
                                    maxLength={15}
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    placeholder="e.g. +62 812 3456 7890"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Other details</h2>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Comments or special request</label>
                            <textarea
                                rows={4}
                                maxLength={300}
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                placeholder="Any special notes for the doctor..."
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 font-semibold text-sm rounded-2xl">
                            {error}
                        </div>
                    )}

                    <div className="pt-6 border-t border-slate-100">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full md:w-auto px-10 py-4 bg-[#009ae2] hover:opacity-90 text-white font-bold rounded-full shadow-lg shadow-[#009ae2]/40 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Booking..." : "Book appointment"}
                        </button>
                    </div>
                </div>

                
                <div className="w-full lg:w-[400px] flex-shrink-0">
                    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-6">
                        <h3 className="text-xl font-bold text-slate-900 mb-6">Appointment details</h3>
                        {selectedDoc && bookingData ? (
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                                        <Calendar className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{appointmentType}</div>
                                        <div className="text-slate-500 text-sm mt-1">
                                            {new Date(bookingData.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                            <br />
                                            at {bookingData.time}
                                        </div>
                                    </div>
                                </div>

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

                                <div className="flex gap-4 pt-6 border-t border-slate-50">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-100">
                                        <img
                                            src={selectedDoc.image || "/resources/avatar-placeholder.png"}
                                            alt={selectedDoc.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 text-sm">{selectedDoc.name}</div>
                                        <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mt-0.5">
                                            {selectedDoc.specialization}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-400 text-sm">Select a doctor and time slot first.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
