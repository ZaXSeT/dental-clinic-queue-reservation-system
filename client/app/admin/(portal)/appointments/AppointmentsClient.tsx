'use client';

import { useState } from 'react';
import { updateAppointmentStatus } from '@/actions/appointment';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { format } from 'date-fns';

export default function AppointmentsClient({ appointments }: { appointments: any[] }) {
    const [filter, setFilter] = useState('upcoming');
    const [isLoading, setIsLoading] = useState<string | null>(null); // storing id of processing item

    // Filter logic
    const filteredApps = appointments.filter(app => {
        if (filter === 'upcoming') return app.status === 'scheduled' || app.status === 'confirmed';
        if (filter === 'history') return app.status === 'completed' || app.status === 'cancelled';
        return true;
    });

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!confirm(`Mark this appointment as ${newStatus}?`)) return;

        setIsLoading(id);
        await updateAppointmentStatus(id, newStatus);
        setIsLoading(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'confirmed': return 'bg-green-50 text-green-700 border-green-200';
            case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'cancelled': return 'bg-red-50 text-red-600 border-red-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
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

            {/* List */}
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

                            {/* Info Left */}
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
                                                Dr. {app.doctor}
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

                            {/* Actions Right */}
                            {filter === 'upcoming' && (
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
        </div>
    );
}
