'use client';

import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useState, useEffect } from "react";
import { loginAction } from "@/actions/auth";

export default function StaffLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ username: "", password: "" });

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        sessionStorage.removeItem('staff_user');
        sessionStorage.removeItem('staff_auth');
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        let hasError = false;
        const newFieldErrors = { username: "", password: "" };

        if (!username) { newFieldErrors.username = "Username is required"; hasError = true; }
        if (!password) { newFieldErrors.password = "Password is required"; hasError = true; }

        if (hasError) {
            setFieldErrors(newFieldErrors);
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.set("username", username);
        formData.set("password", password);

        const res = await loginAction(null, formData);
        
        if (res?.success && res?.data) {
            sessionStorage.setItem('staff_auth', 'true');
            sessionStorage.setItem('staff_user', JSON.stringify({
                name: res.data.username,
                role: res.data.role,
                username: res.data.username
            }));
            router.push("/staff/portal/queue");
        } else {
            setError(res?.message || "Login failed");
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Staff Portal</h1>
                    <p className="text-slate-500">Sign in to manage clinic operations</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className={`h-5 w-5 ${fieldErrors.username ? 'text-red-400' : 'text-slate-400'}`} />
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                required
                                maxLength={16}
                                autoComplete="off"
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                                    setUsername(val);
                                    setFieldErrors(p => ({ ...p, username: '' }));
                                }}
                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 outline-none text-slate-900 transition-colors ${fieldErrors.username ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'}`}
                                placeholder="username"
                            />
                        </div>
                        {fieldErrors.username && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.username}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className={`h-5 w-5 ${fieldErrors.password ? 'text-red-400' : 'text-slate-400'}`} />
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                required
                                maxLength={16}
                                autoComplete="new-password"
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setFieldErrors(p => ({ ...p, password: '' }));
                                }}
                                className={`w-full pl-10 p-3 border rounded-lg focus:ring-2 outline-none text-slate-900 transition-colors ${fieldErrors.password ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : 'border-slate-300 focus:ring-primary focus:border-primary'}`}
                                placeholder="••••••"
                            />
                        </div>
                        {fieldErrors.password && <p className="text-red-500 text-xs mt-1 font-medium">{fieldErrors.password}</p>}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-bold border border-red-100 animate-in fade-in duration-300">
                            {error}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-[#009ae2] text-white font-bold py-3 rounded-lg hover:bg-[#0088cc] transition-all disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98]">
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </main>
    );
}
