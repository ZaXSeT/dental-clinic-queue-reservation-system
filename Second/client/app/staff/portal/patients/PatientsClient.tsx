'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, Calendar, Hash, Stethoscope, Clock, MessageSquare, Users, Pencil, X, Save } from 'lucide-react';
import { format } from 'date-fns';
import { updatePatient } from '@/actions/patient';

export default function PatientsClient({ patients }: { patients: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [localPatients, setLocalPatients] = useState(patients);

    // Edit logic
    const [editingPatient, setEditingPatient] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ name: '', phone: '', email: '' });

    const ALLOWED_DOMAINS = ['gmail.com', 'yahoo.com', 'yahoo.co.id', 'outlook.com'];

    const validateEmailField = (email: string): string => {
        if (!email) return '';
        if (!email.includes('@')) return 'Email must contain @';
        const parts = email.split('@');
        if (parts.length > 2 || parts[1] === '') return 'Invalid email format';
        const domain = parts[1].toLowerCase();
        if (!ALLOWED_DOMAINS.includes(domain))
            return `Email domain "${domain}" not allowed (only gmail.com, yahoo.com, yahoo.co.id, outlook.com)`;
        return '';
    };

    const startEdit = (patient: any) => {
        setFormData({
            name: patient.name || '',
            phone: patient.phone || '',
            email: patient.email || '',
            address: patient.address || ''
        });
        setErrorMsg('');
        setFieldErrors({ name: '', phone: '', email: '' });
        setEditingPatient(patient);
    };

    const handleSave = async () => {
        let hasError = false;
        const newErrors = { name: '', phone: '', email: '' };

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            hasError = true;
        } else if (formData.name.trim().length < 2 || formData.name.trim().length > 16) {
            newErrors.name = 'Name must be 2-16 letters and only contain letters';
            hasError = true;
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
            hasError = true;
        } else if (!formData.phone.startsWith('08') || formData.phone.length < 7 || formData.phone.length > 13) {
            newErrors.phone = 'Phone must be 7-13 numbers long and start with 08.';
            hasError = true;
        }

        if (formData.email) {
            const emailErr = validateEmailField(formData.email);
            if (emailErr) {
                newErrors.email = emailErr;
                hasError = true;
            }
        }

        setFieldErrors(newErrors);
        if (hasError) return;

        setIsSaving(true);
        setErrorMsg('');
        
        try {
            const res = await updatePatient(editingPatient.id, formData);
            if (res.success) {
                setLocalPatients(localPatients.map(p => 
                    p.id === editingPatient.id ? { ...p, ...formData } : p
                ));
                setEditingPatient(null);
            } else {
                setErrorMsg(res.error || "Failed to update patient");
            }
        } catch (e) {
            setErrorMsg("Server error");
        }
        setIsSaving(false);
    };

    const filteredPatients = localPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.phone && p.phone.includes(searchTerm)) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6 px-4 py-6 md:px-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search name, phone, or email…"
                        className="pl-10 pr-4 h-11 w-full bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{filteredPatients.length}</span>
                <span>{filteredPatients.length === 1 ? 'patient' : 'patients'} found</span>
                {searchTerm && <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">"{searchTerm}"</span>}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto overflow-y-auto max-h-[650px] scrollbar-custom">
                    <table className="w-full min-w-max text-left relative">
                        <thead className="sticky top-0 z-10 bg-white shadow-sm ring-1 ring-slate-100">
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Visits</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Registered</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Appointment</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="w-7 h-7 opacity-40" />
                                            </div>
                                            <p className="text-sm font-medium">No patients found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => {
                                    const visits = patient.appointments?.length || 0;
                                    const isNew = !patient.patientType || patient.patientType === 'new';
                                    const bookingFor = patient.bookingFor || 'Myself';
                                    const isSelf = bookingFor.toLowerCase() === 'myself';
                                    return (
                                        <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0 transform group-hover:scale-110 transition-transform">
                                                        {patient.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{patient.name}</span>
                                                        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                            <Hash className="w-2.5 h-2.5" /> {patient.id.slice(0, 8)}
                                                        </span>
                                                        {/* bookingFor badge */}
                                                        <div className="mt-1.5 flex items-center gap-1">
                                                            {isSelf ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-sky-50 text-sky-500 border border-sky-100">
                                                                    <User className="w-2.5 h-2.5" /> Myself
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
                                                                    <Users className="w-2.5 h-2.5" /> {bookingFor}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {patient.guardianName && (
                                                            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                                                Parent/Guardian: {patient.guardianName}
                                                            </span>
                                                        )}
                                                        {(patient.medicalHistory || patient.appointments?.[0]?.notes) && (
                                                            <div className="flex items-start gap-1.5 mt-2 text-xs text-slate-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/50 w-full max-w-[280px]">
                                                                <MessageSquare className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                                                <span className="italic line-clamp-3 break-words">
                                                                    "{patient.medicalHistory || patient.appointments?.[0]?.notes}"
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-2">
                                                    {patient.phone ? (
                                                        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                                                <Phone className="w-3 h-3 text-slate-400" />
                                                            </div>
                                                            {patient.phone}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-300 italic pl-8">No phone</span>
                                                    )}
                                                    {patient.email ? (
                                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                                            <div className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100">
                                                                <Mail className="w-3 h-3 text-slate-300" />
                                                            </div>
                                                            <span className="truncate max-w-[150px]">{patient.email}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-slate-200 italic pl-8">No email</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2.5 rounded-full text-xs font-bold ${
                                                    visits >= 5 ? 'bg-primary/20 text-primary border border-primary/10' : 
                                                    visits >= 2 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                                    'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {visits}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {patient.appointments?.[0] ? (
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                            {format(new Date(patient.appointments[0].date), 'dd MMM yyyy')}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold tracking-wide">
                                                            <Clock className="w-3 h-3 text-slate-300" />
                                                            {patient.appointments[0].time}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-300 italic uppercase tracking-tighter">
                                                        <Calendar className="w-3.5 h-3.5 opacity-30" />
                                                        Never visited
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-xs font-semibold text-slate-600">{format(new Date(patient.createdAt), 'dd MMM yyyy')}</span>
                                                    <span className="text-[10px] text-slate-400 font-bold tracking-wide">{format(new Date(patient.createdAt), 'HH:mm')}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {patient.appointments?.[0] ? (
                                                    <div className="flex flex-col gap-1.5">
                                                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-900">
                                                            <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                                                <Stethoscope className="w-3 h-3 text-primary" />
                                                            </div>
                                                            Dr. {patient.appointments[0].doctor?.name || 'Doctor'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold ml-1 tracking-wide">
                                                            <Clock className="w-3 h-3" />
                                                            {patient.appointments[0].time} · {format(new Date(patient.appointments[0].date), 'dd MMM')}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-200 italic font-medium text-[10px] tracking-widest uppercase">No appointment</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {isNew ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-violet-50 text-violet-600 border border-violet-100 shadow-sm shadow-violet-100/50">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
                                                        Reguler
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm shadow-emerald-100/50">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        Follow-up
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => startEdit(patient)}
                                                    className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-primary rounded-xl transition-colors border border-slate-100 shadow-sm"
                                                    title="Edit Patient"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingPatient && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-lg text-slate-800">Edit Patient Profile</h3>
                            <button onClick={() => setEditingPatient(null)} className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {errorMsg && <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-xl">{errorMsg}</div>}
                            
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => {
                                        const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                        if (val.length <= 16) setFormData({ ...formData, name: val });
                                        if (fieldErrors.name) setFieldErrors(p => ({ ...p, name: '' }));
                                    }}
                                    maxLength={16}
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                        fieldErrors.name ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/20'
                                    }`}
                                />
                                {fieldErrors.name && <p className="text-xs font-bold text-red-500 pl-1">{fieldErrors.name}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        if (val.length <= 13) setFormData({ ...formData, phone: val });
                                        if (fieldErrors.phone) setFieldErrors(p => ({ ...p, phone: '' }));
                                    }}
                                    maxLength={13}
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                        fieldErrors.phone ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/20'
                                    }`}
                                />
                                {fieldErrors.phone && <p className="text-xs font-bold text-red-500 pl-1">{fieldErrors.phone}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email <span className="font-normal normal-case text-slate-300">(Optional)</span></label>
                                <input
                                    type="text"
                                    value={formData.email}
                                    onChange={e => {
                                        const val = e.target.value;
                                        const atIdx = val.indexOf('@');
                                        // Block prefix > 20 chars before @
                                        if (atIdx > 20) return;
                                        setFormData({ ...formData, email: val });
                                        if (fieldErrors.email) setFieldErrors(p => ({ ...p, email: '' }));
                                    }}
                                    maxLength={33}
                                    className={`w-full px-4 py-3 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 transition-all ${
                                        fieldErrors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/20'
                                    }`}
                                />
                                {fieldErrors.email && <p className="text-xs font-bold text-red-500 pl-1">{fieldErrors.email}</p>}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all shadow-md shadow-primary/20 flex justify-center items-center gap-2"
                                >
                                    {isSaving ? "Saving..." : <><Save className="w-4 h-4"/> Save Changes</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}