"use client";

import { Mic, SkipForward, CheckCircle, RefreshCcw, UserPlus, Play, X, User, Phone, Stethoscope, AlertTriangle, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { getQueueState, callNextPatient, completePatient, recallPatient, skipPatient, resetQueue, addWalkIn } from "@/actions/queue";
import { getAllDoctors } from "@/actions/doctor";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export default function QueueControlPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'danger' | 'success';
        action: () => Promise<void>;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        action: async () => { },
    });

    const triggerConfirmation = (title: string, message: string, type: 'info' | 'danger' | 'success', action: () => Promise<void>) => {
        setConfirmation({
            isOpen: true,
            title,
            message,
            type,
            action
        });
    };

    const executeConfirmation = async () => {
        setLoading(true);
        try {
            await confirmation.action();
            setConfirmation(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
            console.error(error);
            alert("Action failed");
        } finally {
            setLoading(false);
        }
    };

    const [showWalkInModal, setShowWalkInModal] = useState(false);
    const [walkInName, setWalkInName] = useState("");
    const [walkInPhone, setWalkInPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);

    const [data, setData] = useState<{
        activeQueues: any[];
        next: any[];
        waitingCount: number;
    }>({ activeQueues: [], next: [], waitingCount: 0 });

    const [doctors, setDoctors] = useState<any[]>([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await getAllDoctors();
            if (res.success && res.data) {
                setDoctors(res.data);
            }
        };
        fetchDoctors();
    }, []);

    const dynamicRooms = [1, 2, 3].map((roomIdNum, index) => {
        const doc = doctors[index];
        return {
            id: roomIdNum.toString(),
            name: doc ? doc.name : `Doctor ${roomIdNum}`,
            label: `Room ${roomIdNum}`,
        };
    });

    const refreshData = async () => {
        try {
            const res = await getQueueState();
            if (res) setData(res);
        } catch (err) {
            console.error("Failed to refresh data:", err);
        }
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleCallNext = (roomId: string) => {
        if (data.waitingCount === 0) {
            alert("No patients waiting in queue!");
            return;
        }

        triggerConfirmation(
            "Call Next Patient?",
            `Are you sure you want to call the next patient to Room ${roomId}?`,
            "info",
            async () => {
                await callNextPatient(roomId);
                await refreshData();
            }
        );
    };

    const handleComplete = (id: string, name: string) => {
        triggerConfirmation(
            "Complete Treatment?",
            `Are you sure you want to finish treatment for ${name}? This will mark them as completed.`,
            "success",
            async () => {
                await completePatient(id);
                await refreshData();
            }
        );
    };

    const handleRecall = (id: string, name: string) => {
        triggerConfirmation(
            "Recall Patient",
            `Call ${name} to the room again?`,
            "info",
            async () => {
                await recallPatient(id);
            }
        );
    };

    const handleSkip = (id: string) => {
        triggerConfirmation(
            "Skip Patient",
            "Are you sure you want to skip this patient? They will be marked as skipped.",
            "danger",
            async () => {
                await skipPatient(id);
                await refreshData();
            }
        );
    };

    const handleReset = () => {
        triggerConfirmation(
            "Reset All Queues?",
            "DANGER: This will delete ALL today's queue data. This action cannot be undone. Are you absolutely sure?",
            "danger",
            async () => {
                await resetQueue();
                await refreshData();
            }
        );
    };

    const openWalkInModal = () => {
        setWalkInName("");
        setWalkInPhone("");
        setPhoneError("");
        setShowWalkInModal(true);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setWalkInPhone(val);
        if (phoneError) setPhoneError("");
    };

    const handleSubmitWalkIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!walkInName.trim()) return;

        if (walkInPhone && (walkInPhone.length < 10 || walkInPhone.length > 14)) {
            setPhoneError("Phone number must be between 10-14 digits");
            return;
        }

        setIsSubmittingWalkIn(true);
        try {
            await addWalkIn(walkInName, walkInPhone);
            await refreshData();
            setShowWalkInModal(false);
        } catch (error) {
            alert("Failed to add walk-in patient");
        } finally {
            setIsSubmittingWalkIn(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Queue Controller</h1>
                    <p className="text-slate-500">Manage 3 consultation rooms</p>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live System
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {dynamicRooms.map((room) => {
                    const active = data.activeQueues.find((q: any) => q.roomId === room.id);
                    const isBusy = !!active;

                    return (
                        <div key={room.id} className={`rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col ${isBusy ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
                            {isBusy && <div className="absolute top-0 w-full h-1.5 bg-primary"></div>}

                            <div className="p-6 flex-1 flex flex-col text-center">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="font-bold text-slate-400 uppercase tracking-wider text-xs">{room.label}</span>
                                    {isBusy ? (
                                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Busy</span>
                                    ) : (
                                        <span className="bg-slate-200 text-slate-500 text-xs font-bold px-2 py-1 rounded">Empty</span>
                                    )}
                                </div>

                                <div className="mb-2">
                                    <h3 className="font-bold text-slate-800">{room.name}</h3>
                                </div>

                                {isBusy ? (
                                    <div className="flex-1 flex flex-col justify-center py-4">
                                        <div className="text-6xl font-black text-primary mb-2 tracking-tighter">#{active.number}</div>
                                        <div className="text-xl font-bold text-slate-900 line-clamp-1">{active.name || active.patient?.name || "Guest"}</div>
                                        <div className="text-sm text-slate-400 mt-1">Check-up</div>
                                    </div>
                                ) : (
                                    <div className="flex-1 flex flex-col justify-center py-8 opacity-50">
                                        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <div className="text-sm font-medium text-slate-500">Ready for patient</div>
                                    </div>
                                )}

                                <div className="mt-6 space-y-3">
                                    {isBusy ? (
                                        <>
                                            <button
                                                onClick={() => handleComplete(active.id, active.name)}
                                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle className="h-4 w-4" /> Finish
                                            </button>
                                            <button
                                                onClick={() => handleRecall(active.id, active.name)}
                                                className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Mic className="h-4 w-4" /> Recall
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => handleCallNext(room.id)}
                                            disabled={data.waitingCount === 0 || loading}
                                            className="w-full py-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary"
                                        >
                                            <Play className="h-4 w-4 fill-current" /> Call Next
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        Next in Line <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs border border-slate-200">{data.waitingCount} Waiting</span>
                    </h3>
                    <div className="space-y-3">
                        {data.next.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-sm">No patients waiting in queue.</div>
                        ) : (
                            data.next.map((p, i) => (
                                <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm group-hover:text-primary group-hover:border-primary/20">
                                            #{p.number}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700">{p.name || p.patient?.name || "Guest"}</span>
                                            <span className="text-xs text-slate-400">General Checkup</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleSkip(p.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Skip">
                                            <SkipForward className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={openWalkInModal}
                            className="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-blue-50/50 hover:border-blue-200 hover:text-blue-600 transition-all text-left group"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 mb-3 group-hover:border-blue-100 group-hover:bg-blue-50">
                                <UserPlus className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                            </div>
                            <div className="font-bold text-sm">Add Walk-in</div>
                            <div className="text-xs text-slate-400 mt-1">Register new guest</div>
                        </button>

                        <button
                            onClick={handleReset}
                            className="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-red-50/50 hover:border-red-200 hover:text-red-600 transition-all text-left group"
                        >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 mb-3 group-hover:border-red-100 group-hover:bg-red-50">
                                <RefreshCcw className="h-5 w-5 text-slate-400 group-hover:text-red-500" />
                            </div>
                            <div className="font-bold text-sm">Reset Today</div>
                            <div className="text-xs text-slate-400 mt-1">Clear all queues</div>
                        </button>
                    </div>
                </div>
            </div>

            {showWalkInModal && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Add Walk-In</h2>
                                <p className="text-slate-500 text-sm">Register a new patient to the queue</p>
                            </div>
                            <button onClick={() => setShowWalkInModal(false)} className="bg-slate-50 hover:bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitWalkIn} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={walkInName}
                                        onChange={(e) => setWalkInName(e.target.value)}
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
                                        value={walkInPhone}
                                        onChange={handlePhoneChange}
                                        placeholder="e.g. 0812..."
                                        className={`w-full pl-12 pr-4 py-3.5 bg-slate-50 border rounded-xl font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${phoneError ? 'border-red-300 focus:ring-red-200 focus:border-red-500' : 'border-slate-200 focus:ring-primary/20 focus:border-primary'}`}
                                        maxLength={14}
                                    />
                                </div>
                                {phoneError && <p className="text-xs font-bold text-red-500 pl-1">{phoneError}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowWalkInModal(false)}
                                    className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingWalkIn}
                                    className="flex-[2] py-3.5 bg-primary hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmittingWalkIn ? (
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
            )}

            {confirmation.isOpen && mounted && createPortal(
                <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${confirmation.type === 'danger' ? 'bg-red-50 text-red-500' :
                            confirmation.type === 'success' ? 'bg-green-50 text-green-500' :
                                'bg-blue-50 text-blue-500'
                            }`}>
                            {confirmation.type === 'danger' ? <AlertTriangle className="w-6 h-6" /> :
                                confirmation.type === 'success' ? <CheckCircle className="w-6 h-6" /> :
                                    <Info className="w-6 h-6" />}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">{confirmation.title}</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">{confirmation.message}</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                                className="flex-1 py-3 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeConfirmation}
                                disabled={loading}
                                className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${confirmation.type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' :
                                    confirmation.type === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' :
                                        'bg-primary hover:bg-sky-600 shadow-primary/20'
                                    }`}
                            >
                                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
