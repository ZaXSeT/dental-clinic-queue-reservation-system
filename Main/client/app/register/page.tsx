'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { registerPatient } from '@/actions/patientAuth';

import { ArrowLeft, User, Mail, Phone, Lock } from 'lucide-react';

// Daftar domain email yang valid
const VALID_DOMAINS = [
    'gmail.com', 'yahoo.com', 'yahoo.co.id', 'hotmail.com', 'outlook.com',
    'live.com', 'icloud.com', 'me.com', 'protonmail.com', 'mail.com',
    'ymail.com', 'aol.com', 'msn.com', 'rocketmail.com',
];

// Peta typo umum → domain yang benar
const TYPO_MAP: Record<string, string> = {
    'gamil.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmial.com': 'gmail.com',
    'gmil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'gmail.con': 'gmail.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'hotmail.con': 'hotmail.com',
    'hotmal.com': 'hotmail.com',
    'outloo.com': 'outlook.com',
    'outlok.com': 'outlook.com',
};

function validateEmailDomain(email: string): { valid: boolean; suggestion?: string; message?: string } {
    const parts = email.split('@');
    if (parts.length !== 2) return { valid: false, message: 'Format email tidak valid.' };

    const domain = parts[1].toLowerCase();

    if (TYPO_MAP[domain]) {
        return {
            valid: false,
            suggestion: `${parts[0]}@${TYPO_MAP[domain]}`,
            message: `Domain "${domain}" tidak dikenali. Maksud kamu "${parts[0]}@${TYPO_MAP[domain]}"?`,
        };
    }

    if (!VALID_DOMAINS.includes(domain)) {
        return {
            valid: false,
            message: `Domain email "${domain}" tidak dikenali. Gunakan email yang valid (contoh: @gmail.com, @yahoo.com).`,
        };
    }

    return { valid: true };
}

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [emailSuggestion, setEmailSuggestion] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const email = e.target.value.trim();
        if (!email) return;
        const result = validateEmailDomain(email);
        if (!result.valid) {
            setEmailError(result.message || '');
            setEmailSuggestion(result.suggestion || '');
        } else {
            setEmailError('');
            setEmailSuggestion('');
        }
    };

    const handleEmailChange = () => {
        if (emailError) {
            setEmailError('');
            setEmailSuggestion('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setNameError('');
        setPhoneError('');
        setPasswordError('');

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const password = formData.get('password') as string;
        const confirmPassword = formData.get('confirm_password') as string;

        let hasError = false;

        // Validasi domain email sebelum submit
        const emailCheck = validateEmailDomain(email);
        if (!emailCheck.valid) {
            setEmailError(emailCheck.message || '');
            setEmailSuggestion(emailCheck.suggestion || '');
            hasError = true;
        }

        if (name.trim().length < 3) {
            setNameError('Nama harus memiliki minimal 3 karakter.');
            hasError = true;
        }

        const phoneRegex = /^08[0-9]{5,11}$/;
        if (!phoneRegex.test(phone)) {
            setPhoneError('Nomor HP harus dimulai dengan 08, hanya angka, dan memiliki panjang 7 hingga 13 digit.');
            hasError = true;
        }

        if (password.length < 8) {
            setPasswordError('Password harus memiliki minimal 8 karakter.');
            hasError = true;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError('Password harus mengandung minimal satu huruf besar (uppercase).');
            hasError = true;
        } else if (!/[0-9]/.test(password)) {
            setPasswordError('Password harus mengandung minimal satu angka.');
            hasError = true;
        } else if (password !== confirmPassword) {
            setPasswordError('Password dan konfirmasi password tidak cocok.');
            hasError = true;
        }

        if (hasError) {
            setLoading(false);
            return;
        }

        const res = await registerPatient(null, formData);

        if (res?.success && res?.requiresVerification) {
            router.push(`/verify-email?email=${encodeURIComponent(res.email || '')}&redirect=${encodeURIComponent(redirect)}`);
        } else if (res?.success) {
            router.push(redirect);
        } else {
            setError(res?.message || 'Registration failed');
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
            <div className="hidden lg:flex lg:w-1/2 relative bg-sky-900 overflow-hidden items-center justify-center">
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
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-900 via-primary to-blue-400 opacity-80 z-10" />
                
                <div className="relative z-20 text-white max-w-xl text-center px-12 animate-in fade-in zoom-in duration-1000">
                    <div className="mb-8 inline-flex items-center justify-center p-6 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                        <div className="h-20 w-20 bg-white" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                    </div>
                    <h1 className="text-5xl font-extrabold tracking-tight mb-6">Join Us Today</h1>
                    <p className="text-xl text-sky-100 font-medium leading-relaxed">Create your account to start booking appointments and managing your queue status easily from anywhere.</p>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 xl:px-32 relative overflow-y-auto">
                <Link href="/" className="absolute top-8 left-8 lg:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm tracking-wide bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 hover:shadow-md group z-50">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Back to Home
                </Link>

                <div className="mx-auto w-full max-w-sm lg:max-w-md my-auto animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 fill-mode-both py-12">
                    <div className="text-center lg:text-left mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your account</h2>
                        <p className="mt-3 text-slate-500 text-lg">
                            Or{' '}
                            <Link href="/login" className="font-bold text-primary hover:text-sky-500 transition-colors underline decoration-2 underline-offset-4 decoration-primary/30">
                                sign in to your existing account
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className={`h-5 w-5 ${nameError ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <input name="name" type="text" required onChange={() => setNameError('')} className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 transition-all sm:text-sm font-medium outline-none ${nameError ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : 'border-slate-200 focus:ring-primary/10 focus:border-primary'}`} placeholder="John Doe" />
                            </div>
                            {nameError && (
                                <div className="mt-2 text-red-600 text-sm font-medium flex items-center gap-1">
                                    ⚠️ {nameError}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className={`h-5 w-5 ${emailError ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    onBlur={handleEmailBlur}
                                    onChange={handleEmailChange}
                                    className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 transition-all sm:text-sm font-medium outline-none ${
                                        emailError
                                            ? 'border-red-400 focus:ring-red-100 focus:border-red-400'
                                            : 'border-slate-200 focus:ring-primary/10 focus:border-primary'
                                    }`}
                                    placeholder="you@gmail.com"
                                />
                            </div>
                            {emailError && (
                                <div className="mt-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm font-medium">
                                    ⚠️ {emailError}
                                    {emailSuggestion && (
                                        <span className="block mt-1 font-bold text-red-700">
                                            Gunakan: {emailSuggestion}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className={`h-5 w-5 ${phoneError ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <input name="phone" type="tel" required maxLength={13} onInput={(e) => { e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, ''); }} onChange={() => setPhoneError('')} className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 transition-all sm:text-sm font-medium outline-none ${phoneError ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : 'border-slate-200 focus:ring-primary/10 focus:border-primary'}`} placeholder="081234567890" />
                            </div>
                            {phoneError && (
                                <div className="mt-2 text-red-600 text-sm font-medium flex items-center gap-1">
                                    ⚠️ {phoneError}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${passwordError ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <input name="password" type="password" required onChange={() => setPasswordError('')} className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 transition-all sm:text-sm font-medium outline-none ${passwordError ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : 'border-slate-200 focus:ring-primary/10 focus:border-primary'}`} placeholder="••••••••" />
                            </div>
                            {passwordError && (
                                <div className="mt-2 text-red-600 text-sm font-medium flex items-center gap-1">
                                    ⚠️ {passwordError}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Re-enter Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`h-5 w-5 ${passwordError ? 'text-red-400' : 'text-slate-400'}`} />
                                </div>
                                <input name="confirm_password" type="password" required onChange={() => setPasswordError('')} className={`block w-full pl-11 pr-4 py-3.5 bg-slate-50 border rounded-2xl focus:bg-white focus:ring-4 transition-all sm:text-sm font-medium outline-none ${passwordError ? 'border-red-400 focus:ring-red-100 focus:border-red-400' : 'border-slate-200 focus:ring-primary/10 focus:border-primary'}`} placeholder="••••••••" />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold flex items-center justify-center border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="pt-2">
                            <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-2xl text-base font-bold text-white bg-primary hover:bg-sky-500 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
