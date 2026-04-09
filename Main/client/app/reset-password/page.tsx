'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { resetPassword } from '@/actions/patientAuth';
import { ArrowLeft, Lock, ShieldCheck } from 'lucide-react';

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter the 6-digit OTP code');
            setLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        formData.set('otp', otpCode);
        formData.set('email', email);

        const res = await resetPassword(null, formData);

        if (res?.success) {
            router.push('/login?reset=success');
        } else {
            setError(res?.message || 'Terjadi kesalahan');
        }
        setLoading(false);
    };

    return (
        <div className="mx-auto w-full max-w-sm lg:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
            <div className="text-center lg:text-left mb-8">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Password</h2>
                <p className="mt-3 text-slate-500 text-base">
                    OTP code sent to <span className="font-bold text-primary">{email || 'your email'}</span>
                </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
                {/* OTP input */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">OTP Code (6 digits)</label>
                    <div className="flex gap-2 justify-between">
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none"
                            />
                        ))}
                    </div>
                </div>

                {/* New password */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="newPassword"
                            type="password"
                            required
                            minLength={8}
                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all sm:text-sm font-medium outline-none"
                            placeholder="At least 8 characters"
                        />
                    </div>
                </div>

                {/* Confirm password */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={8}
                            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all sm:text-sm font-medium outline-none"
                            placeholder="Re-enter new password"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl text-base font-bold text-white bg-primary hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                    <ShieldCheck className="w-5 h-5" />
                    {loading ? 'Saving...' : 'Save New Password'}
                </button>

                <p className="text-center text-sm text-slate-500">
                    Didn't receive the code?{' '}
                    <Link href="/forgot-password" className="font-bold text-primary hover:text-sky-500 transition-colors">
                        Resend code
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(() => {});
        }
    }, []);

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
                        <ShieldCheck className="h-20 w-20 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">Verify OTP</h1>
                    <p className="text-xl text-sky-100 font-medium leading-relaxed">
                        Enter the 6-digit code we sent to your email, then create your new password.
                    </p>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative">
                <Link href="/forgot-password" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm tracking-wide bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:shadow-md group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back
                </Link>

                <Suspense fallback={<div className="text-center text-slate-500">Loading...</div>}>
                    <ResetPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
