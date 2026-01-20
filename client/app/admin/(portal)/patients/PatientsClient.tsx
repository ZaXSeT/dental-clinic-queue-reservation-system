'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, Calendar, History } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientsClient({ patients }: { patients: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.phone && p.phone.includes(searchTerm)) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-5 w-5" />
                </div>
                <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    className="pl-10 pr-4 py-3 w-full bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-slate-700 placeholder:text-slate-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-400 font-bold">
                                <th className="p-6">Patient Name</th>
                                <th className="p-6">Contact Info</th>
                                <th className="p-6 text-center">Total Visits</th>
                                <th className="p-6">Last Visit</th>
                                <th className="p-6">Registered</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <User className="w-12 h-12 opacity-20" />
                                            <p>No patients found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold shadow-sm">
                                                    {patient.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{patient.name}</div>
                                                    <div className="text-xs text-slate-400">ID: ...{patient.id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                {patient.phone ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Phone className="w-3.5 h-3.5 text-slate-300" />
                                                        {patient.phone}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-slate-300 italic">No phone</div>
                                                )}
                                                {patient.email ? (
                                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                                        <Mail className="w-3.5 h-3.5 text-slate-300" />
                                                        {patient.email}
                                                    </div>
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="inline-flex flex-col items-center justify-center bg-slate-100 h-10 min-w-[40px] px-2 rounded-lg font-bold text-slate-600 text-sm">
                                                {patient._count.appointments}
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            {patient.appointments[0] ? (
                                                <div className="text-sm font-medium text-slate-600 flex items-center gap-2">
                                                    <History className="w-4 h-4 text-slate-300" />
                                                    {format(new Date(patient.appointments[0].date), 'dd MMM yyyy')}
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300 italic">Never</span>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="text-sm text-slate-400 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-slate-200" />
                                                {format(new Date(patient.createdAt), 'dd MMM yyyy')}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
