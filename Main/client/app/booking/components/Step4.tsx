"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, User, UserPlus, Calendar, MapPin, ChevronDown, Check } from "lucide-react";
import { BookingSelection, Doctor, BookingForType, PatientType } from "@/lib/types";

interface Step4Props {
    bookingData: BookingSelection | null;
    selectedDoc: Doctor | null;
    appointmentType: string | null;
    bookingFor: BookingForType;
    patientType: PatientType;
    onBack: () => void;
    onSetBookingFor: (type: BookingForType) => void;
    loggedInUser?: any;
    onComplete: (data: { doctor: string; date: string; time: string; treatment: string; name: string }) => void;
}

export default function Step4({
    bookingData,
    selectedDoc,
    appointmentType,
    bookingFor,
    patientType,
    loggedInUser,
    onBack,
    onSetBookingFor,
    onComplete,
}: Step4Props) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [legalSex, setLegalSex] = useState<"Male" | "Female">("Male");
    const [showSexDropdown, setShowSexDropdown] = useState(false);
    const [showGSexDropdown, setShowGSexDropdown] = useState(false);
    const [birthDate, setBirthDate] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [comments, setComments] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const setFieldError = (field: string, msg: string) =>
        setFieldErrors(prev => ({ ...prev, [field]: msg }));
    const clearFieldError = (field: string) =>
        setFieldErrors(prev => { const n = { ...prev }; delete n[field]; return n; });


    useEffect(() => {
        if (loggedInUser && loggedInUser.email) {
            setEmail(loggedInUser.email);
            if (loggedInUser.phone) setPhone(loggedInUser.phone);
            
            if (bookingFor === "Myself") {
                const parts = loggedInUser.name.split(' ');
                setFirstName(parts[0] || "");
                setLastName(parts.slice(1).join(' ') || "");
                
                if (loggedInUser.birthDate) {
                    setBirthDate(new Date(loggedInUser.birthDate).toISOString().split('T')[0]);
                }
                if (loggedInUser.gender) {
                    setLegalSex(loggedInUser.gender as "Male" | "Female");
                }
            } else {
                // Clear patient-specific fields when booking for someone else
                setFirstName("");
                setLastName("");
                setBirthDate("");
                // We keep email and phone as they are the account holder's contact points
            }
        }
    }, [loggedInUser, bookingFor]);

    const [gFirstName, setGFirstName] = useState("");
    const [gLastName, setGLastName] = useState("");
    const [gLegalSex, setGLegalSex] = useState<"Male" | "Female">("Male");
    const [gBirthDate, setGBirthDate] = useState("");

    const handleSubmit = async () => {
        if (!bookingData || !selectedDoc) return;

        const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{8,13}$/;
        const zipRegex = /^[0-9]{4,10}$/;

        let hasError = false;
        const errs: Record<string, string> = {};

        if (!firstName) errs.firstName = "First name is required.";
        if (!lastName) errs.lastName = "Last name is required.";
        if (!birthDate) errs.birthDate = "Date of birth is required.";
        if (!zipCode) errs.zipCode = "Zip/postal code is required.";
        if (!email) errs.email = "Email is required.";
        if (!phone) errs.phone = "Phone number is required.";

        if (bookingFor === "Child or dependent") {
            if (!gFirstName) errs.gFirstName = "Guardian first name is required.";
            if (!gLastName) errs.gLastName = "Guardian last name is required.";
            if (!gBirthDate) errs.gBirthDate = "Guardian date of birth is required.";
        }

        if (Object.keys(errs).length > 0) {
            setFieldErrors(errs);
            setError("Please fill in all required fields.");
            return;
        }

        // --- Regex/Format Validations ---
        if (!nameRegex.test(firstName.trim())) {
            setFieldErrors(prev => ({ ...prev, firstName: "Please enter a valid first name (letters only)." }));
            hasError = true;
        }
        if (!nameRegex.test(lastName.trim())) {
            setFieldErrors(prev => ({ ...prev, lastName: "Please enter a valid last name (letters only)." }));
            hasError = true;
        }
        if (!emailRegex.test(email.trim())) {
            setFieldErrors(prev => ({ ...prev, email: "Please enter a valid email address." }));
            hasError = true;
        }
        if (!phoneRegex.test(phone.trim())) {
            setFieldErrors(prev => ({ ...prev, phone: "Phone must be 8-13 digits long." }));
            hasError = true;
        }
        if (!zipRegex.test(zipCode.trim())) {
            setFieldErrors(prev => ({ ...prev, zipCode: "Please enter a valid zip/postal code." }));
            hasError = true;
        }

        if (bookingFor === "Child or dependent") {
            if (gFirstName && !nameRegex.test(gFirstName.trim())) {
                setFieldErrors(prev => ({ ...prev, gFirstName: "Please enter a valid guardian first name." }));
                hasError = true;
            }
            if (gLastName && !nameRegex.test(gLastName.trim())) {
                setFieldErrors(prev => ({ ...prev, gLastName: "Please enter a valid guardian last name." }));
                hasError = true;
            }
        }

        if (hasError) {
            setError("Please correct the errors before submitting.");
            return;
        }

        if (comments && comments.length > 300) {
            setError("Comments must not exceed 300 characters.");
            return;
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
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">First name <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    maxLength={16}
                                    value={firstName}
                                    onChange={(e) => { setFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, "")); clearFieldError('firstName'); }}
                                    placeholder="e.g. John"
                                    className={`w-full p-3 rounded-xl border ${fieldErrors.firstName ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium`}
                                />
                                {fieldErrors.firstName && <p className="text-red-500 text-xs font-medium">{fieldErrors.firstName}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Last name <span className="text-red-400">*</span></label>
                                <input
                                    type="text"
                                    maxLength={16}
                                    value={lastName}
                                    onChange={(e) => { setLastName(e.target.value.replace(/[^a-zA-Z\s]/g, "")); clearFieldError('lastName'); }}
                                    placeholder="e.g. Doe"
                                    className={`w-full p-3 rounded-xl border ${fieldErrors.lastName ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium`}
                                />
                                {fieldErrors.lastName && <p className="text-red-500 text-xs font-medium">{fieldErrors.lastName}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Legal sex</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowSexDropdown(!showSexDropdown)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-[#009ae2] transition-all font-medium text-slate-600 focus:ring-1 focus:ring-[#009ae2] outline-none"
                                    >
                                        <span>{legalSex}</span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showSexDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {showSexDropdown && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setShowSexDropdown(false)} />
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                {(["Male", "Female"] as const).map((opt) => (
                                                    <div
                                                        key={opt}
                                                        onClick={() => {
                                                            setLegalSex(opt);
                                                            setShowSexDropdown(false);
                                                        }}
                                                        className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${legalSex === opt ? 'bg-blue-50/50 text-[#009ae2]' : 'text-slate-600'}`}
                                                    >
                                                        <span className="font-bold text-sm">{opt}</span>
                                                        {legalSex === opt && <Check className="w-4 h-4" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Date of birth <span className="text-red-400">*</span></label>
                                <input
                                    type="date"
                                    max={new Date().toISOString().split("T")[0]}
                                    value={birthDate}
                                    onChange={(e) => { setBirthDate(e.target.value); clearFieldError('birthDate'); }}
                                    className={`w-full p-3 rounded-xl border ${fieldErrors.birthDate ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium text-slate-600`}
                                />
                                {fieldErrors.birthDate && <p className="text-red-500 text-xs font-medium">{fieldErrors.birthDate}</p>}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-bold text-slate-700">Zip/postal code <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                maxLength={10}
                                value={zipCode}
                                onChange={(e) => { setZipCode(e.target.value.replace(/\D/g, "")); clearFieldError('zipCode'); }}
                                placeholder="e.g. 20351"
                                className={`w-full p-3 rounded-xl border ${fieldErrors.zipCode ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium`}
                            />
                            {fieldErrors.zipCode && <p className="text-red-500 text-xs font-medium">{fieldErrors.zipCode}</p>}
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
                                        maxLength={16}
                                        value={gFirstName}
                                        onChange={(e) => { setGFirstName(e.target.value.replace(/[^a-zA-Z\s]/g, "")); clearFieldError('gFirstName'); }}
                                        className={`w-full p-3 rounded-xl border ${fieldErrors.gFirstName ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium`}
                                    />
                                    {fieldErrors.gFirstName && <p className="text-red-500 text-xs font-medium">{fieldErrors.gFirstName}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian last name <span className="text-red-400">*</span></label>
                                    <input
                                        type="text"
                                        maxLength={16}
                                        value={gLastName}
                                        onChange={(e) => { setGLastName(e.target.value.replace(/[^a-zA-Z\s]/g, "")); clearFieldError('gLastName'); }}
                                        className={`w-full p-3 rounded-xl border ${fieldErrors.gLastName ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium`}
                                    />
                                    {fieldErrors.gLastName && <p className="text-red-500 text-xs font-medium">{fieldErrors.gLastName}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian legal sex</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setShowGSexDropdown(!showGSexDropdown)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-[#009ae2] transition-all font-medium text-slate-600 focus:ring-1 focus:ring-[#009ae2] outline-none"
                                        >
                                            <span>{gLegalSex}</span>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showGSexDropdown ? 'rotate-180' : ''}`} />
                                        </button>
                                        
                                        {showGSexDropdown && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setShowGSexDropdown(false)} />
                                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {(["Male", "Female"] as const).map((opt) => (
                                                        <div
                                                            key={opt}
                                                            onClick={() => {
                                                                setGLegalSex(opt);
                                                                setShowGSexDropdown(false);
                                                            }}
                                                            className={`px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${gLegalSex === opt ? 'bg-blue-50/50 text-[#009ae2]' : 'text-slate-600'}`}
                                                        >
                                                            <span className="font-bold text-sm">{opt}</span>
                                                            {gLegalSex === opt && <Check className="w-4 h-4" />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Parent/Guardian date of birth <span className="text-red-400">*</span></label>
                                    <input
                                        type="date"
                                        max={new Date().toISOString().split("T")[0]}
                                        value={gBirthDate}
                                        onChange={(e) => { setGBirthDate(e.target.value); clearFieldError('gBirthDate'); }}
                                        className={`w-full p-3 rounded-xl border ${fieldErrors.gBirthDate ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium text-slate-600`}
                                    />
                                    {fieldErrors.gBirthDate && <p className="text-red-500 text-xs font-medium">{fieldErrors.gBirthDate}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact details</h2>
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Email <span className="text-red-400">*</span></label>
                                <input
                                    type="email"
                                    maxLength={100}
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }}
                                    disabled={!!loggedInUser?.email}
                                    placeholder="e.g. john@email.com"
                                    className={`w-full p-3 rounded-xl border ${fieldErrors.email ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium ${loggedInUser?.email ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-300' : 'bg-white'}`}
                                />
                                {fieldErrors.email && <p className="text-red-500 text-xs font-medium">{fieldErrors.email}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700">Phone number <span className="text-red-400">*</span></label>
                                <input
                                    type="tel"
                                    maxLength={13}
                                    value={phone}
                                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); clearFieldError('phone'); }}
                                    placeholder="e.g. +62 812 3456 7890"
                                    className={`w-full p-3 rounded-xl border ${fieldErrors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'} focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium`}
                                />
                                {fieldErrors.phone && <p className="text-red-500 text-xs font-medium">{fieldErrors.phone}</p>}
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
