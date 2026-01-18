'use client';

import { useState } from 'react';
import { updateAdminProfile, updateClinicSettings } from '@/actions/settings';
import { User, Lock, Building, Save, AlertCircle, CheckCircle } from 'lucide-react';

export default function SettingsClient({ admin, clinic }: { admin: any, clinic: any }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Form States
    const [profileForm, setProfileForm] = useState({
        name: admin?.name || '',
        username: admin?.username || ''
    });

    const [passwordForm, setPasswordForm] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [clinicForm, setClinicForm] = useState({
        name: clinic?.name || '',
        address: clinic?.address || '',
        phone: clinic?.phone || '',
        email: clinic?.email || ''
    });

    // Handlers
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        const res = await updateAdminProfile(admin.id, profileForm);

        setIsLoading(false);
        if (res.success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setMessage({ type: 'error', text: res.error || 'Failed to update.' });
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match!' });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setIsLoading(true);
        const res = await updateAdminProfile(admin.id, { password: passwordForm.newPassword });
        setIsLoading(false);

        if (res.success) {
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm({ newPassword: '', confirmPassword: '' });
        } else {
            setMessage({ type: 'error', text: res.error || 'Failed to update.' });
        }
    };

    const handleClinicUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);

        const res = await updateClinicSettings(clinicForm);

        setIsLoading(false);
        if (res.success) {
            setMessage({ type: 'success', text: 'Clinic information updated!' });
        } else {
            setMessage({ type: 'error', text: res.error || 'Failed to update info.' });
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'clinic', label: 'Clinic Info', icon: Building },
    ];

    if (!admin) {
        return (
            <div className="p-8 text-center border border-dashed border-red-200 bg-red-50 rounded-2xl text-red-600">
                Admin data not found. Please seed the database.
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Tabs */}
            <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setMessage(null); }}
                            className={`w-full flex items-center gap-3 p-4 rounded-xl font-bold transition-all text-sm ${activeTab === tab.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
                        >
                            <Icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm min-h-[400px]">
                    <h2 className="text-xl font-bold text-slate-800 mb-1 capitalize">{activeTab.replace('-', ' ')} Settings</h2>
                    <p className="text-slate-400 text-sm mb-8">Manage your {activeTab} preferences</p>

                    {message && (
                        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            {message.text}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileUpdate} className="max-w-md space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                <input
                                    type="text"
                                    value={profileForm.name}
                                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                                <input
                                    type="text"
                                    value={profileForm.username}
                                    onChange={e => setProfileForm({ ...profileForm, username: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="pt-4">
                                <button disabled={isLoading} className="px-6 py-3 bg-primary hover:bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all flex items-center gap-2">
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'security' && (
                        <form onSubmit={handlePasswordUpdate} className="max-w-md space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    placeholder="Min. 6 characters"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Confirm Password</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="pt-4">
                                <button disabled={isLoading} className="px-6 py-3 bg-primary hover:bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'clinic' && (
                        <form onSubmit={handleClinicUpdate} className="max-w-md space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Clinic Name</label>
                                <input
                                    type="text"
                                    value={clinicForm.name}
                                    onChange={e => setClinicForm({ ...clinicForm, name: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Address</label>
                                <textarea
                                    value={clinicForm.address}
                                    onChange={e => setClinicForm({ ...clinicForm, address: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all h-24 resize-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Phone</label>
                                <input
                                    type="text"
                                    value={clinicForm.phone}
                                    onChange={e => setClinicForm({ ...clinicForm, phone: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Email (Optional)</label>
                                <input
                                    type="email"
                                    value={clinicForm.email}
                                    onChange={e => setClinicForm({ ...clinicForm, email: e.target.value })}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="pt-4">
                                <button disabled={isLoading} className="px-6 py-3 bg-primary hover:bg-sky-600 text-white rounded-xl font-bold shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50">
                                    <Save className="w-4 h-4" />
                                    {isLoading ? 'Saving...' : 'Save Information'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
