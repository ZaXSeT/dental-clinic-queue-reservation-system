"use client";

import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { useEffect } from "react";
import { loginAction } from "@/actions/auth";

const initialState: { message?: string; success?: boolean } = {
    message: "",
    success: false,
};

export default function AdminLogin() {
    const [state, formAction] = useFormState(loginAction, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            // Intelligent redirect based on domain
            if (window.location.hostname.startsWith('admin')) {
                router.push("/dashboard");
            } else {
                router.push("/admin/dashboard");
            }
        }
    }, [state.success, router]);

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

                <form action={formAction} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            required
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900"
                            placeholder="username"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none text-slate-900"
                            placeholder="••••••"
                        />
                    </div>

                    {state.message && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center">
                            {state.message}
                        </div>
                    )}

                    <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        Sign In
                    </button>
                </form>
            </div>
        </main>
    );
}
