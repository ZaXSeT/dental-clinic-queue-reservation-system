'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginPatient } from '@/actions/patientAuth';

import { ArrowLeft, Stethoscope, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);
    //const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [successMsg, setSuccessMsg] = useState(searchParams.get('reset') === 'success' ? 'Password reset successful! Please log in.' : '');

    useEffect(() => {
        fetch('/api/patient/me')
            .then(r => r.json())
            .then(d => {
                if (d.loggedIn) {
                    const params = new URLSearchParams(window.location.search);
                    router.replace(params.get('callbackUrl') || '/');
                }
            })
            .catch(() => {});
    }, [router]);

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError('');

    //     const formData = new FormData(e.currentTarget);
    //     const res = await loginPatient(null, formData);

    //     if (res?.requiresVerification) {
    //         router.push(`/verify-email?email=${encodeURIComponent(formData.get('email') as string)}`);
    //     } else if (res?.success) {
    //         const params = new URLSearchParams(window.location.search);
    //         router.push(params.get('callbackUrl') || '/');
    //     } else {
    //         setError(res?.message || 'Login failed');
    //     }
    //     setLoading(false);
    // };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    setEmailError('');
    setPasswordError('');

    const formData = new FormData(e.currentTarget);

    const email = (formData.get('email') as string)?.trim();
    const password = (formData.get('password') as string) || '';

    let hasError = false;

    // ================= EMAIL =================
    if (!email || email.length === 0) {
        setEmailError('Email is required');
        hasError = true;
    } else if (!email.includes('@')) {
        setEmailError('Email must include "@"');
        hasError = true;
    } else {
        const [localPart, domain] = email.split('@');

        const allowedDomains = [
            'gmail.com',
            'yahoo.com',
            'yahoo.co.id',
            'outlook.com'
        ];

        if (!localPart || localPart.length < 3) {
            setEmailError('Email username must be at least 3 characters');
            hasError = true;
        }

        if (!allowedDomains.includes(domain)) {
            setEmailError('Only gmail.com, yahoo.com, yahoo.co.id, outlook.com allowed');
            hasError = true;
        }
    }

    // ================= PASSWORD =================
    if (!password) {
    setPasswordError('Password is required');
    hasError = true;
} else if (password.length < 8) {
    setPasswordError('Password must be at least 8 characters');
    hasError = true;
} else if (!/[A-Z]/.test(password)) {
    setPasswordError('Must include at least one uppercase letter');
    hasError = true;
} else if (!/[a-z]/.test(password)) {
    setPasswordError('Must include at least one lowercase letter');
    hasError = true;
} else if (!/[0-9]/.test(password)) {
    setPasswordError('Must include at least one number');
    hasError = true;
}

    // ================= STOP IF ANY ERROR =================
    if (hasError) {
        setLoading(false);
        return;
    }

    // ================= API CALL =================
    const res = await loginPatient(null, formData);

    if (res?.requiresVerification) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } else if (res?.success) {
        const params = new URLSearchParams(window.location.search);
        router.push(params.get('callbackUrl') || '/');
    } else {
        setEmailError(res?.message || 'Login failed');
    }

    setLoading(false);
};

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
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-blue-700 opacity-80 z-10" />
                
                <div className="relative z-20 text-white max-w-xl text-center px-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="mb-8 inline-flex items-center justify-center p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <div className="h-20 w-20 bg-white" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">Welcome Back</h1>
                    <p className="text-xl text-sky-100 font-medium leading-relaxed">Log in to book your live queues, view appointment times, and manage your dental health records seamlessly.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative">
                <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm tracking-wide bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:shadow-md group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
                </Link>

                <div className="mx-auto w-full max-w-sm lg:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Log in to your account</h2>
                        <p className="mt-3 text-slate-500 text-lg">
                            Or{' '}
                            <Link href="/register" className="font-bold text-primary hover:text-sky-500 transition-colors underline decoration-2 underline-offset-4 decoration-primary/30">
                                create a new account
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">
        Email address
    </label>

    <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
        </div>

        <input
            name="email"
            type="text"
            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all sm:text-sm font-medium outline-none"
            placeholder="you@example.com"
        />
    </div>

    {/* ✅ Show error here */}
    {emailError && (
        <p className="mt-2 text-sm text-red-500 font-medium">
            {emailError}
        </p>
    )}
</div>

                       <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">
        Password
    </label>

    <div className="relative">
        {/* icon stays fixed */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
        </div>

        {/* input */}
        <input
            name="password"
            type="password"
            className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all sm:text-sm font-medium outline-none"
            placeholder="••••••••"
        />
    </div>

    {/* error OUTSIDE input container */}
    {passwordError && (
        <p className="mt-2 text-sm text-red-500 font-medium">
            {passwordError}
        </p>
    )}
</div>

                        {successMsg && (
                            <div className="bg-green-50 text-green-700 p-4 rounded-2xl text-sm font-bold flex items-center justify-center border border-green-200">
                                ✅ {successMsg}
                            </div>
                        )}

                        

                        <div>
                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl text-base font-bold text-white bg-primary hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                {loading ? 'Signing in...' : 'Log in'}
                            </button>
                        </div>

                        <div className="text-center">
                            <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-sky-500 transition-colors">
                                Forgot password?
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
