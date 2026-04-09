"use client";

import { Phone, User, UserPlus, X } from "lucide-react";
import { createPortal } from "react-dom";

interface WalkInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string, phone: string, doctorId?: string, time?: string) => Promise<void>;
    isSubmitting: boolean;
    doctors: any[];
}

export default function WalkInModal({ isOpen, onClose, onSubmit, isSubmitting, doctors }: WalkInModalProps) {
    const [name, setName] = (require("react")).useState("");
    const [phone, setPhone] = (require("react")).useState("");
    const [doctorId, setDoctorId] = (require("react")).useState("");
    const [timeField, setTimeField] = (require("react")).useState("");
    const [phoneError, setPhoneError] = (require("react")).useState("");

    const selectedDoctor = (require("react")).useMemo(() => {
        return doctors.find(d => d.id === doctorId);
    }, [doctorId, doctors]);

    const availableSlots = (require("react")).useMemo(() => {
        if (!selectedDoctor) return [];
        const today = new Date();
        const dayStr = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
        
        let parsedAvailability: Record<string, string[]> = {};
        try {
            parsedAvailability = typeof selectedDoctor.availability === 'string' ? JSON.parse(selectedDoctor.availability) : selectedDoctor.availability || {};
        } catch(e) {}
        
        const allDaySlots: string[] = parsedAvailability[dayStr] || [];
        
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        const currentTimeStr = `${String(today.getHours()).padStart(2, '0')}:${String(today.getMinutes()).padStart(2, '0')}`;

        return allDaySlots.filter(t => {
            if (t < currentTimeStr) return false; // Passed time
            
            const isBooked = selectedDoctor.appointments?.some((app: any) => {
                const slDate = new Date(app.date);
                const slDateStr = `${slDate.getFullYear()}-${String(slDate.getMonth() + 1).padStart(2, '0')}-${String(slDate.getDate()).padStart(2, '0')}`;
                return slDateStr === todayStr && app.time === t;
            });
            
            return !isBooked;
        });
    }, [selectedDoctor]);

    (require("react")).useEffect(() => {
        setTimeField("");
    }, [doctorId]);


    if (!isOpen) return null;

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setPhone(val);
        if (phoneError) setPhoneError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        if (phone && (phone.length < 10 || phone.length > 14)) {
            setPhoneError("Phone number must be between 10-14 digits");
            return;
        }

        await onSubmit(name, phone, doctorId || undefined, timeField || undefined);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Add Walk-In</h2>
                        <p className="text-slate-500 text-sm">Register a new patient to the queue</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <User className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. John Doe"
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                autoFocus
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Phone Number <span className="text-slate-300 font-normal normal-case">(Optional, Digits Only)</span></label>
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

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Select Doctor <span className="text-slate-300 font-normal normal-case">(Optional)</span></label>
                        <select
                            value={doctorId}
                            onChange={(e) => setDoctorId(e.target.value)}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                            <option value="">Any Available Doctor</option>
                            {doctors.map(doc => (
                                <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialization}</option>
                            ))}
                        </select>
                    </div>

                    {doctorId && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Select Time <span className="text-slate-300 font-normal normal-case">(Optional)</span></label>
                            {availableSlots.length > 0 ? (
                                <select
                                    value={timeField}
                                    onChange={(e) => setTimeField(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                >
                                    <option value="">No specific time</option>
                                    {availableSlots.map(t => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
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
