'use client';

import { useState } from 'react';
import { Calendar, Clock, User } from 'lucide-react';

interface Appointment {
    id: string;
    date: Date;
    time: string;
    status: string;
    treatment?: string | null;
    notes?: string | null;
    patient: {
        id: string;
        name: string;
        email?: string | null;
        phone?: string | null;
    };
}

interface AppointmentsClientProps {
    appointments: Appointment[];
}

const STATUS_STYLES: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AppointmentsClient({ appointments }: AppointmentsClientProps) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = appointments.filter(a => {
        const matchSearch = a.patient.name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || a.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex gap-3 flex-wrap">
                <input
                    type="text"
                    placeholder="Search patient..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64"
                />
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                    <option value="all">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16 text-slate-400">
                    <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">No appointments found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(a => (
                        <div key={a.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-bold text-slate-800">{a.patient.name}</div>
                                <div className="text-sm text-slate-400">{a.patient.email || a.patient.phone}</div>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Calendar className="w-4 h-4" />
                                {new Date(a.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                {a.time}
                            </div>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_STYLES[a.status] || 'bg-slate-100 text-slate-600'}`}>
                                {a.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}