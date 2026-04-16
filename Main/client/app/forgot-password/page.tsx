'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { forgotPassword } from '@/actions/patientAuth';
import { ArrowLeft, Mail, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({ email: '' });
    const [sent, setSent] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;

        if (!email) {
            setFieldErrors({ email: 'Email is required' });
            setLoading(false);
            return;
        }

        const res = await forgotPassword(null, formData);

        if (res?.success) {
            router.push(`/reset-password?email=${encodeURIComponent(res.email || '')}`);
        } else {
            const msg = res?.message || 'An error occurred';
            if (msg.includes('registered')) {
                setFieldErrors({ email: msg });
            } else {
                setError(msg);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
            {/* Left panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center">
                <video ref={videoRef} autoPlay loop muted playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    onCanPlay={() => videoRef.current?.play()}
                >
                    <source src="/resources/bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-700 opacity-80 z-10" />
                <div className="relative z-20 text-white max-w-xl text-center px-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-8 inline-flex items-center justify-center p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20">
                        <KeyRound className="h-20 w-20 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">Forgot Password?</h1>
                    <p className="text-xl text-sky-100 font-medium leading-relaxed">
                        Don't worry — enter your email and we'll send you a 6-digit OTP code to reset your password.
                    </p>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative">
                <Link href="/login" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm tracking-wide bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:shadow-md group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Login
                </Link>

                <div className="mx-auto w-full max-w-sm lg:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reset Password</h2>
                        <p className="mt-3 text-slate-500 text-base">
                            Enter your registered email address. We'll send a 6-digit OTP code to reset your password.
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${fieldErrors.email ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    maxLength={33}
                                    onChange={() => setFieldErrors({ email: '' })}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border ${fieldErrors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/10'} rounded-2xl focus:bg-white focus:ring-4 focus:border-primary transition-all sm:text-sm font-medium outline-none`}
                                    placeholder="you@gmail.com"
                                />
                            </div>
                            {fieldErrors.email && <p className="mt-1.5 ml-1 text-xs font-bold text-red-500 overflow-visible break-words">{fieldErrors.email}</p>}
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl text-base font-bold text-white bg-primary hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {loading ? 'Sending OTP...' : 'Send OTP Code'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
