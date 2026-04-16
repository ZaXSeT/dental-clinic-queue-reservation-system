'use client';

import { useState, Suspense, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Link from 'next/link';
import { verifyRegistrationToken } from '@/actions/patientAuth';
import { ArrowLeft, MailCheck, ShieldCheck } from 'lucide-react';

function VerifyForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const redirect = searchParams.get('redirect') || '/';
    
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldError, setFieldError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!token) {
            setFieldError('Verification code is required');
            setLoading(false);
            return;
        }

        const res = await verifyRegistrationToken(email, token);

        if (res?.success) {
            setSuccess(true);
            setTimeout(() => {
                router.push(redirect);
            }, 2000);
        } else {
            setError(res?.message || 'Verification failed');
        }
        setLoading(false);
    };

    return (
        <div className="mx-auto w-full max-w-sm lg:max-w-md my-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both py-12">
            <div className="text-center lg:text-left mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Verify Your Account</h2>
                <p className="mt-3 text-slate-500 text-lg">
                    Enter the code sent to your email to continue.
                </p>
            </div>

            {success ? (
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex justify-center items-center gap-4 animate-in fade-in zoom-in">
                    <ShieldCheck className="h-8 w-8 text-green-500" />
                    <div>
                        <div className="font-bold text-green-700 text-lg">Verified!</div>
                        <div className="text-green-600 text-sm">Redirecting you safely...</div>
                    </div>
                </div>
            ) : (
                <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 text-center">
                        <div className="text-sm text-slate-500 mb-2">Code sent to</div>
                        <div className="font-bold text-slate-800 break-all">{email}</div>

                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Verification Code</label>
                        <input 
                            name="token" 
                            type="text" 
                            required 
                            maxLength={6}
                            value={token}
                            onChange={e => {
                                setToken(e.target.value);
                                setFieldError('');
                            }}
                            pattern="[0-9]*"
                            placeholder="123456"
                            className={`text-center text-4xl tracking-[0.5em] font-black appearance-none block w-full px-3 py-6 bg-slate-50 border ${fieldError ? 'border-red-400 focus:ring-red-100' : 'border-slate-200 focus:ring-primary/10'} rounded-2xl focus:bg-white focus:ring-4 focus:border-primary transition-all outline-none`}
                        />
                        {fieldError && <p className="mt-2 text-center text-xs font-bold text-red-500 overflow-visible break-words">{fieldError}</p>}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center justify-center border border-red-100">
                            {error}
                        </div>
                    )}

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl text-base font-bold text-white bg-primary hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            {loading ? 'Verifying...' : 'Verify Identity'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden font-sans">
            <div className="hidden lg:flex lg:w-1/2 relative bg-primary overflow-hidden items-center justify-center">
                <video
                    ref={videoRef}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                    onCanPlay={() => videoRef.current?.play()}
                    onEnded={() => videoRef.current?.play()}
                >
                    <source src="/resources/bg.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 via-primary to-blue-600 opacity-80 z-10" />
                
                <div className="relative z-20 text-white max-w-xl text-center px-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-8 inline-flex items-center justify-center p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <div className="h-20 w-20 bg-white" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">Guard Your Data</h1>
                    <p className="text-xl text-sky-100 font-medium leading-relaxed">Identity verification protects your medical records and ensures a secure queueing experience.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative overflow-y-auto">
                <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm tracking-wide bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:shadow-md group z-50">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
                </Link>

                <Suspense fallback={<div className="text-center p-8 text-slate-400 font-medium">Checking token...</div>}>
                    <VerifyForm />
                </Suspense>
            </div>
        </div>
    );
}
