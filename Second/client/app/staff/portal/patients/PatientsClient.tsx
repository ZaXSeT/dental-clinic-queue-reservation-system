'use client';

import { useState } from 'react';
import { Search, User, Phone, Mail, Calendar, MapPin, Plus, X, Hash } from 'lucide-react';
import { format } from 'date-fns';

export default function PatientsClient({ patients }: { patients: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [localPatients, setLocalPatients] = useState(patients);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
    });

    const [errors, setErrors] = useState<any>({});
    const [loading, setLoading] = useState(false);

    const filteredPatients = localPatients.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.phone && p.phone.includes(searchTerm)) ||
        (p.email && p.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'name' && !/^[A-Za-z\s]*$/.test(value)) return;
        if (name === 'phone') {
            const digits = value.replace(/\D/g, '');
            setFormData({ ...formData, phone: digits });
            return;
        }
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name || formData.name.length < 3 || formData.name.length > 50) {
            newErrors.name = 'Name must be 3–50 letters.';
        }
        if (!formData.phone || formData.phone.length < 8 || formData.phone.length > 12) {
            newErrors.phone = 'Phone must be 8–12 digits.';
        }
        if (!formData.address || formData.address.length < 5 || formData.address.length > 100) {
            newErrors.address = 'Address must be 5–100 characters.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        try {
            const res = await fetch('/api/patients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) {
                setErrors({ api: data.error || 'Failed to save' });
                setLoading(false);
                return;
            }

            setLocalPatients([data, ...localPatients]);
            setFormData({ name: '', phone: '', email: '', address: '' });
            setShowForm(false);
            setErrors({});
        } catch (err) {
            console.error(err);
            setErrors({ api: 'Server error' });
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="space-y-6">
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
                <button
                    onClick={() => { setShowForm(!showForm); setErrors({}); }}
                    className="flex items-center gap-2 px-5 h-11 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/25 whitespace-nowrap"
                >
                    {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    {showForm ? 'Cancel' : 'Add Patient'}
                </button>
            </div>
            {showForm && (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
                        <h3 className="text-sm font-bold text-slate-700">New Patient</h3>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name *</label>
                            <input
                                name="name"
                                placeholder="e.g. John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone *</label>
                            <input
                                name="phone"
                                placeholder="Digits only"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.phone ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                            <input
                                name="email"
                                placeholder="optional"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Address *</label>
                            <input
                                name="address"
                                placeholder="e.g. Jl. Merdeka No. 1"
                                value={formData.address}
                                onChange={handleChange}
                                className={`w-full h-11 px-4 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition ${errors.address ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                            />
                            {errors.address && <p className="text-red-500 text-xs">{errors.address}</p>}
                        </div>

                        {errors.api && <p className="md:col-span-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{errors.api}</p>}

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-11 bg-primary text-white rounded-xl font-semibold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md shadow-primary/20 disabled:opacity-50"
                            >
                                {loading ? 'Saving…' : 'Save Patient'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{filteredPatients.length}</span>
                <span>{filteredPatients.length === 1 ? 'patient' : 'patients'} found</span>
                {searchTerm && <span className="text-xs bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">"{searchTerm}"</span>}
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Patient</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Contact</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400 text-center">Visits</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Last Visit</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Registered</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-3 text-slate-400">
                                            <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User className="w-7 h-7 opacity-40" />
                                            </div>
                                            <p className="font-medium">No patients found</p>
                                            <p className="text-xs">Try a different search term</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient, idx) => {
                                    const visits = patient._count?.appointments || 0;
                                    return (
                                        <tr key={patient.id} className="hover:bg-slate-50/70 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="font-semibold text-slate-800 text-sm">{patient.name}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    {patient.phone && (
                                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                            {patient.phone}
                                                        </div>
                                                    )}
                                                    {patient.email && (
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                            <Mail className="w-3 h-3" />
                                                            {patient.email}
                                                        </div>
                                                    )}
                                                    {!patient.phone && !patient.email && (
                                                        <span className="text-xs text-slate-300 italic">No contact</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center justify-center min-w-[2rem] h-7 px-2.5 rounded-full text-xs font-bold ${
                                                    visits >= 5
                                                        ? 'bg-primary/10 text-primary'
                                                        : visits >= 2
                                                        ? 'bg-emerald-50 text-emerald-600'
                                                        : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                    {visits}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-300" />
                                                    {patient.appointments?.[0]
                                                        ? format(new Date(patient.appointments[0].date), 'dd MMM yyyy')
                                                        : <span className="text-slate-300 italic text-xs">Never</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {format(new Date(patient.createdAt), 'dd MMM yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-1.5 text-sm text-slate-500 max-w-[160px]">
                                                    <MapPin className="w-3.5 h-3.5 text-slate-300 flex-shrink-0 mt-0.5" />
                                                    <span className="truncate">{patient.address || <span className="text-slate-300 italic">—</span>}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}