"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Phone, User, UserPlus, X, ChevronDown, Check, Stethoscope, Clock } from "lucide-react";
import { createPortal } from "react-dom";

interface WalkInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, phone: string, doctorId?: string, time?: string) => Promise<void>;
    isSubmitting: boolean;
    doctors: any[];
}

export default function WalkInModal({ isOpen, onClose, onSubmit, isSubmitting, doctors }: WalkInModalProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [doctorId, setDoctorId] = useState("");
    const [timeField, setTimeField] = useState("");
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [doctorDropdownOpen, setDoctorDropdownOpen] = useState(false);
    const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
    const doctorDropdownRef = useRef<HTMLDivElement>(null);
    const timeDropdownRef = useRef<HTMLDivElement>(null);

    const selectedDoctor = useMemo(() => doctors.find(d => d.id === doctorId), [doctorId, doctors]);

    const availableSlots = useMemo(() => {
        if (!selectedDoctor) return [];
        const today = new Date();
        const dayStr = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

        let parsedAvailability: Record<string, string[]> = {};
        try {
            parsedAvailability = typeof selectedDoctor.availability === 'string'
                ? JSON.parse(selectedDoctor.availability)
                : selectedDoctor.availability || {};
        } catch (e) { }

        const allDaySlots: string[] = parsedAvailability[dayStr] || [];
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const currentTimeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

        return allDaySlots.filter(t => {
            if (t < currentTimeStr) return false;
            const isBooked = selectedDoctor.appointments?.some((app: any) => {
                const slDate = new Date(app.date);
                const slDateStr = `${slDate.getFullYear()}-${String(slDate.getMonth() + 1).padStart(2, '0')}-${String(slDate.getDate()).padStart(2, '0')}`;
                return slDateStr === todayStr && app.time === t;
            });
            return !isBooked;
        });
    }, [selectedDoctor]);

    useEffect(() => { setTimeField(""); }, [doctorId]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (doctorDropdownRef.current && !doctorDropdownRef.current.contains(e.target as Node)) {
                setDoctorDropdownOpen(false);
            }
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(e.target as Node)) {
                setTimeDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setPhone(val);
        if (phoneError) setPhoneError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let hasError = false;

        if (!name.trim()) {
            setNameError('Name is required');
            hasError = true;
        } else if (name.trim().length < 2 || name.trim().length > 16) {
            setNameError('Name must be 2-16 letters and only contain letters');
            hasError = true;
        }

        if (phone) {
            if (!/^08/.test(phone)) {
                setPhoneError("Phone number must start with 08");
                hasError = true;
            } else if (phone.length < 10 || phone.length > 14) {
                setPhoneError("Phone number must be between 10-14 digits");
                hasError = true;
            }
        }

        if (hasError) return;
        await onSubmit(name, phone, doctorId || undefined, timeField || undefined);
    };

    const doctorInitials = (name: string) => name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    const avatarColors = [
        'from-sky-400 to-blue-600',
        'from-violet-400 to-purple-600',
        'from-emerald-400 to-teal-600',
    ];

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Add Walk-In</h2>
                        <p className="text-slate-500 text-sm">Register a reguler patient to the queue</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <User className={`w-5 h-5 ${nameError ? 'text-red-400' : 'text-slate-400'}`} />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                    if (val.length <= 16) setName(val);
                                    if (nameError) setNameError('');
                                }}
                                maxLength={16}
                                placeholder="e.g. John Doe"
                                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                                    nameError
                                        ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
                                        : 'border-slate-200 focus:ring-primary/20 focus:border-primary'
                                }`}
                                autoFocus
                            />
                        </div>
                        {nameError && <p className="text-xs font-bold text-red-500 pl-1">{nameError}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                            Phone Number <span className="text-slate-300 font-normal normal-case">(Optional, Digits Only)</span>
                        </label>
                        <div className="relative">
                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${phoneError ? 'text-red-400' : 'text-slate-400'}`}>
                                <Phone className="w-5 h-5" />
                            </div>
                            <input
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="e.g. 0812..."
                                className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${phoneError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-slate-200 focus:ring-primary/20 focus:border-primary'}`}
                                maxLength={14}
                            />
                        </div>
                        {phoneError && <p className="text-xs font-bold text-red-500 pl-1">{phoneError}</p>}
                    </div>

                    <div className="space-y-2" ref={doctorDropdownRef}>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                            Select Doctor <span className="text-slate-300 font-normal normal-case">(Optional)</span>
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setDoctorDropdownOpen(p => !p)}
                                className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            >
                                {selectedDoctor ? (
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-800 text-sm truncate">{selectedDoctor.name}</div>
                                        <div className="text-xs text-slate-400">{selectedDoctor.specialization}</div>
                                    </div>
                                ) : (
                                    <span className="font-bold text-slate-400 text-sm flex-1">Any Available Doctor</span>
                                )}
                                <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto shrink-0 transition-transform duration-200 ${doctorDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {doctorDropdownOpen && (
                                <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 max-h-48 overflow-y-auto">
                                    <div
                                        onClick={() => { setDoctorId(""); setDoctorDropdownOpen(false); }}
                                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${!doctorId ? 'bg-primary/5' : ''}`}
                                    >
                                        <span className="font-bold text-slate-600 text-sm flex-1">Any Available Doctor</span>
                                        {!doctorId && <Check className="w-4 h-4 text-primary shrink-0" />}
                                    </div>
                                    <div className="border-t border-slate-100" />
                                    {doctors.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => { setDoctorId(doc.id); setDoctorDropdownOpen(false); }}
                                            className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${doctorId === doc.id ? 'bg-primary/5' : ''}`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div className="font-bold text-slate-800 text-sm truncate">{doc.name}</div>
                                                <div className="text-xs text-slate-400">{doc.specialization}</div>
                                            </div>
                                            {doctorId === doc.id && <Check className="w-4 h-4 text-primary shrink-0" />}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {doctorId && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2" ref={timeDropdownRef}>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                                Select Time <span className="text-slate-300 font-normal normal-case">(Optional)</span>
                            </label>
                            {availableSlots.length > 0 ? (
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setTimeDropdownOpen(p => !p)}
                                        className="w-full flex items-center gap-3 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    >
                                        <span className={`font-bold text-sm flex-1 ${timeField ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {timeField || "No specific time"}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-slate-400 ml-auto shrink-0 transition-transform duration-200 ${timeDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {timeDropdownOpen && (
                                        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                                            <div
                                                onClick={() => { setTimeField(""); setTimeDropdownOpen(false); }}
                                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${!timeField ? 'bg-primary/5' : ''}`}
                                            >
                                                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                                <span className="font-bold text-slate-600 text-sm flex-1">No specific time</span>
                                                {!timeField && <Check className="w-4 h-4 text-primary shrink-0" />}
                                            </div>
                                            <div className="border-t border-slate-100" />
                                            {availableSlots.map(t => (
                                                <div
                                                    key={t}
                                                    onClick={() => { setTimeField(t); setTimeDropdownOpen(false); }}
                                                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${timeField === t ? 'bg-primary/5' : ''}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full shrink-0 ${timeField === t ? 'bg-primary' : 'bg-slate-300'}`} />
                                                    <span className="font-bold text-slate-800 text-sm flex-1">{t}</span>
                                                    {timeField === t && <Check className="w-4 h-4 text-primary shrink-0" />}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-sm font-medium">
                                    No available timeslots today for this doctor.
                                </div>
                            )}
                        </div>
                    )}

                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-[2] py-3.5 bg-primary hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Adding...</span>
                            ) : (
                                <>Add to Queue <UserPlus className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}
