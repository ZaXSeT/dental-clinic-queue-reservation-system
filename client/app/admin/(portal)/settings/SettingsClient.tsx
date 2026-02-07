'use client';

import { useState } from 'react';
import { updateAdminProfile, updateClinicSettings } from '@/actions/settings';
import { createAdminAccount } from '@/actions/owner';
import { User, Lock, Building, Save, AlertCircle, CheckCircle, UserPlus, Shield, ChevronDown, ShieldCheck, UserCog } from 'lucide-react';

export default function SettingsClient({ admin, clinic }: { admin: any, clinic: any }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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

    const [userForm, setUserForm] = useState({
        name: '',
        username: '',
        password: '',
        role: 'admin'
    });

    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsLoading(true);
        const res = await createAdminAccount(userForm);
        setIsLoading(false);
        if (res.success) {
            setMessage({ type: 'success', text: 'New account created successfully!' });
            setUserForm({ name: '', username: '', password: '', role: 'admin' });
        } else {
            setMessage({ type: 'error', text: res.error || 'Failed to create account.' });
        }
    };

    const tabs = [
        { id: 'profile', label: 'My Profile', icon: User },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'clinic', label: 'Clinic Info', icon: Building },
        ...(admin.role === 'owner' ? [{ id: 'users', label: 'User Management', icon: UserPlus }] : []),
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

                    {activeTab === 'users' && (
                        <div className="space-y-8">
                            <form onSubmit={handleCreateUser} className="max-w-md space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={userForm.name}
                                        onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={userForm.username}
                                        onChange={e => setUserForm({ ...userForm, username: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="johndoe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Initial Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={userForm.password}
                                        onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Access Role</label>
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                                            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-700 flex items-center justify-between hover:border-primary/30 transition-all focus:ring-2 focus:ring-primary/10"
                                        >
                                            <div className="flex items-center gap-3">
                                                {userForm.role === 'owner' ? (
                                                    <ShieldCheck className="w-4 h-4 text-primary" />
                                                ) : (
                                                    <UserCog className="w-4 h-4 text-slate-400" />
                                                )}
                                                <span className="capitalize">{userForm.role}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isRoleDropdownOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)}></div>
                                                <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-slate-200/60 p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                                                    {[
                                                        { id: 'admin', label: 'Admin', desc: 'Manage appointments & patients', icon: UserCog },
                                                        { id: 'owner', label: 'Owner', desc: 'Full access including billing', icon: ShieldCheck }
                                                    ].map((role) => (
                                                        <button
                                                            key={role.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setUserForm({ ...userForm, role: role.id });
                                                                setIsRoleDropdownOpen(false);
                                                            }}
                                                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group ${userForm.role === role.id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-slate-50'}`}
                                                        >
                                                            <div className={`p-2 rounded-lg ${userForm.role === role.id ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-primary transition-colors'}`}>
                                                                <role.icon className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <div className={`text-sm font-black ${userForm.role === role.id ? 'text-primary' : 'text-slate-700'}`}>{role.label}</div>
                                                                <div className="text-[10px] text-slate-400 font-bold group-hover:text-slate-500">{role.desc}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <button disabled={isLoading} className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-[1.5rem] font-black shadow-xl shadow-slate-200 transition-all flex items-center gap-3 disabled:opacity-50 uppercase tracking-[0.15em] text-[10px] active:scale-95 border-b-4 border-slate-950">
                                        <Shield className="w-4 h-4 text-primary" />
                                        {isLoading ? 'Creating...' : 'Authorize Admin Account'}
                                    </button>
                                </div>
                            </form>

                            <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex gap-4 items-center">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                                    <AlertCircle className="w-6 h-6 text-slate-400" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Security Protocol</h4>
                                    <p className="text-[11px] text-slate-500 leading-relaxed mt-1 font-medium">
                                        This action is logged. Assigning <b>Owner</b> roles grants full database and billing access.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
