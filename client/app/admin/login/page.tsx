"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === "admin" && password === "admin") {
            router.push("/admin/dashboard");
        } else {
            alert("Invalid credentials (try admin/admin)");
        }
    };

    return (
        <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
                <div className="text-center mb-8">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800">Admin Portal</h1>
                    <p className="text-slate-500">Sign in to manage clinic operations</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900"
                            placeholder="••••••"
                        />
                    </div>
                    <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}
