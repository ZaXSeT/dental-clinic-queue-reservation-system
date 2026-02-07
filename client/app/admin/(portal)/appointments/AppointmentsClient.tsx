'use client';

import { useState } from 'react';
import { updateAppointmentStatus } from '@/actions/appointment';
import { createInvoice } from '@/actions/billing';
import { Calendar, Clock, User, CheckCircle, XCircle, FileText, Receipt, Save } from 'lucide-react';
import { format } from 'date-fns';


export default function AppointmentsClient({ appointments }: { appointments: any[] }) {
    const [filter, setFilter] = useState('upcoming');
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [finishingApp, setFinishingApp] = useState<any>(null);
    const [completionData, setCompletionData] = useState({ treatment: '', fee: 200000 });

    const filteredApps = appointments.filter(app => {
        if (filter === 'all') return true;
        if (filter === 'upcoming') return app.status === 'scheduled' || app.status === 'confirmed' || app.status === 'Scheduled';
        if (filter === 'history') return app.status === 'completed' || app.status === 'cancelled';
        return true;
    });

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (newStatus === 'completed') {
            const app = appointments.find(a => a.id === id);
            setFinishingApp(app);
            setCompletionData({ treatment: app.treatment || '', fee: 200000 });
            return;
        }

        if (!confirm(`Mark this appointment as ${newStatus}?`)) return;

        setIsLoading(id);
        await updateAppointmentStatus(id, newStatus);
        setIsLoading(null);
    };

    const handleFinalizeCompletion = async () => {
        if (!finishingApp) return;
        setIsLoading(finishingApp.id);

        try {
            // 1. Update status to completed
            await updateAppointmentStatus(finishingApp.id, 'completed');

            // 2. Create invoice with clinical data
            await createInvoice(
                finishingApp.id,
                completionData.treatment,
                completionData.fee
            );

            setIsLoading(null);
            setFinishingApp(null);
            window.location.reload();
        } catch (error) {
            console.error("Error finalizing:", error);
            setIsLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        switch (s) {
            case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
            case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'upcoming' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Upcoming
                </button>
                <button
                    onClick={() => setFilter('history')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    History
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredApps.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
                        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-500">No appointments found</h3>
                        <p className="text-slate-400 text-sm">No items in this category.</p>
                    </div>
                ) : (
                    filteredApps.map((app) => (
                        <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="flex items-start gap-4">
                                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-bold text-xl border border-blue-100">
                                    {format(new Date(app.date), 'dd')}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-900 text-lg">{app.patient.name}</h3>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {format(new Date(app.date), 'MMMM yyyy')}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            {app.time}
                                        </div>
                                        {app.doctor && (
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-4 h-4 text-slate-400" />
                                                Dr. {app.doctor.name}
                                            </div>
                                        )}
                                    </div>
                                    {app.notes && (
                                        <div className="mt-3 flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-600 max-w-md">
                                            <FileText className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                            {app.notes}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {(filter === 'upcoming' || filter === 'all') && (app.status === 'scheduled' || app.status === 'confirmed' || app.status === 'Scheduled') && (
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <button
                                        onClick={() => handleStatusUpdate(app.id, 'completed')}
                                        disabled={!!isLoading}
                                        className="flex-1 md:flex-none px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-green-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Complete
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(app.id, 'cancelled')}
                                        disabled={!!isLoading}
                                        className="flex-1 md:flex-none px-4 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl font-bold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <XCircle className="w-4 h-4" /> Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {finishingApp && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-green-100 text-green-600 rounded-2xl">
                                <Receipt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Finalize Visit</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Mark as Completed & Generate Invoice</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Patient</p>
                                <p className="font-bold text-slate-800">{finishingApp.patient.name}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Treatment Done</label>
                                <textarea
                                    value={completionData.treatment}
                                    onChange={e => setCompletionData({ ...completionData, treatment: e.target.value })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none text-sm"
                                    placeholder="e.g. Scaling, Filling on 24, Extraction..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Base Service Fee (Rp)</label>
                                <input
                                    type="number"
                                    value={completionData.fee}
                                    onChange={e => setCompletionData({ ...completionData, fee: parseInt(e.target.value) })}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setFinishingApp(null)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleFinalizeCompletion}
                                disabled={!!isLoading}
                                className="flex-[2] py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-lg shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <><CheckCircle className="w-5 h-5" /> Finalize Appointment</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
