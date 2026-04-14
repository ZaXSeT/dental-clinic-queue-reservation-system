'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createManualInvoice } from '@/actions/billing';
import { getPatients } from '@/actions/patient';
import { ArrowLeft, Receipt, User, Stethoscope, DollarSign, Search, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const TREATMENTS = [
    'General Consultation',
    'Teeth Cleaning (Scaling)',
    'Tooth Extraction',
    'Cavity Filling',
    'Root Canal Treatment',
    'Dental Crown',
    'Teeth Whitening',
    'Orthodontic Consultation',
    'X-Ray',
    'Emergency Dental Care',
];

export default function NewInvoicePage() {
    const router = useRouter();
    const [patients, setPatients] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [treatment, setTreatment] = useState(TREATMENTS[0]);
    const [customTreatment, setCustomTreatment] = useState('');
    const [fee, setFee] = useState('200000');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getPatients().then(res => {
            if (res.success && res.data) setPatients(res.data);
        });
    }, []);

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.phone && p.phone.includes(search))
    );

    const finalTreatment = treatment === 'Other (custom)' ? customTreatment : treatment;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) { setError('Please select a patient.'); return; }
        if (!finalTreatment.trim()) { setError('Please enter a treatment description.'); return; }
        const feeNum = parseFloat(fee.replace(/\D/g, ''));
        if (!feeNum || feeNum <= 0) { setError('Please enter a valid fee amount.'); return; }

        setLoading(true);
        setError('');
        const res = await createManualInvoice({
            patientId: selectedPatient.id,
            treatment: finalTreatment,
            fee: feeNum,
        });
        setLoading(false);

        if (res.success) {
            setSuccess(true);
            setTimeout(() => router.push('/staff/portal/billing'), 1500);
        } else {
            setError(res.error || 'Failed to create invoice.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="flex items-center gap-4">
                <Link
                    href="/staff/portal/billing"
                    className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary hover:border-primary/30 transition-all shadow-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">New Invoice</h1>
                    <p className="text-sm text-slate-500">Create a manual invoice for a patient</p>
                </div>
            </div>

            {success ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
                    <CheckCircle className="w-14 h-14 text-green-500" />
                    <h2 className="text-xl font-bold text-green-800">Invoice Created!</h2>
                    <p className="text-green-600 text-sm">Redirecting to billing page…</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-slate-700">Select Patient</span>
                        </div>
                        <div className="p-5 space-y-3">
                            
                            <div className="relative">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search by name or phone…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="pl-10 pr-4 h-10 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                />
                            </div>

                            
                            {selectedPatient && (
                                <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                                            {selectedPatient.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-800">{selectedPatient.name}</div>
                                            <div className="text-xs text-slate-400">{selectedPatient.phone || 'No phone'}</div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => setSelectedPatient(null)} className="text-xs text-red-400 hover:text-red-600 font-semibold">
                                        Change
                                    </button>
                                </div>
                            )}

                            
                            {!selectedPatient && (
                                <div className="max-h-48 overflow-y-auto space-y-1">
                                    {filteredPatients.length === 0 ? (
                                        <p className="text-center text-slate-400 text-sm py-4">No patients found</p>
                                    ) : filteredPatients.map(p => (
                                        <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => { setSelectedPatient(p); setSearch(''); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors border border-transparent hover:border-slate-200"
                                        >
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">
                                                {p.name[0]}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-700">{p.name}</div>
                                                <div className="text-xs text-slate-400">{p.phone || 'No phone'}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-slate-700">Treatment / Service</span>
                        </div>
                        <div className="p-5 space-y-3">
                            <select
                                value={treatment}
                                onChange={e => setTreatment(e.target.value)}
                                className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            >
                                {TREATMENTS.map(t => <option key={t}>{t}</option>)}
                                <option>Other (custom)</option>
                            </select>
                            {treatment === 'Other (custom)' && (
                                <input
                                    type="text"
                                    placeholder="Describe the treatment…"
                                    value={customTreatment}
                                    onChange={e => setCustomTreatment(e.target.value)}
                                    className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    maxLength={300}
                                />
                            )}
                        </div>
                    </div>

                    
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-slate-700">Fee Amount (IDR)</span>
                        </div>
                        <div className="p-5">
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">Rp</span>
                                <input
                                    type="number"
                                    min="1"
                                    value={fee}
                                    onChange={e => setFee(e.target.value)}
                                    className="pl-12 pr-4 h-11 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                    placeholder="200000"
                                />
                            </div>
                        </div>
                    </div>

                    
                    {error && (
                        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm font-semibold rounded-xl">
                            ⚠️ {error}
                        </div>
                    )}

                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        <Receipt className="w-4 h-4" />
                        {loading ? 'Creating Invoice…' : 'Create Invoice'}
                    </button>
                </form>
            )}
        </div>
    );
}
