'use server';

import { prisma } from '@/lib/prisma';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

export async function loginPatient(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Please enter both email and password' };
    }

    try {
        const patient = await prisma.patient.findFirst({
            where: { email, password: { not: null } },
        });

        if (!patient || !patient.password) {
            return { message: 'Invalid email or password' };
        }

        if (!patient.emailVerified) {
            return { message: 'Your account is not verified. Please check your email/messages for the verification code.', requiresVerification: true };
        }

        const isMatch = await bcrypt.compare(password, patient.password);
        if (!isMatch) {
            return { message: 'Invalid email or password' };
        }

        const token = await new SignJWT({ id: patient.id, email: patient.email, name: patient.name, role: 'patient' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(key);

        cookies().set('patient_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 
        });

        return {
            success: true,
            data: {
                id: patient.id,
                name: patient.name,
                email: patient.email
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return { message: 'An error occurred during login' };
    }
}

async function sendVerificationEmail(email: string, name: string, token: string) {
    console.log(`\n==========================================`);
    console.log(`📩 SYSTEM LOG: EMAIL VERIFICATION`);
    console.log(`To: ${email}`);
    console.log(`Your Verification Code is: ${token}`);
    console.log(`==========================================\n`);

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            await transporter.sendMail({
                from: `"Dental Clinic" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Your Account Verification Code',
                html: `
                    <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <div style="background-color: #0ea5e9; padding: 24px; text-align: center;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">🦷 Dental Clinic</h1>
                        </div>
                        <div style="padding: 32px 24px; background-color: #ffffff;">
                            <h2 style="margin-top: 0; color: #334155; font-size: 20px;">Verify Your Identity</h2>
                            <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 24px;">
                                Hello <strong>${name}</strong>,<br/>Thank you for registering. Please use the verification code below to verify your email address and activate your account.
                            </p>
                            <div style="text-align: center; margin: 32px 0;">
                                <span style="font-size: 40px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; background-color: #f1f5f9; border-radius: 8px; color: #0284c7; border: 2px dashed #bae6fd;">${token}</span>
                            </div>
                            <p style="color: #94a3b8; font-size: 14px; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
                        </div>
                    </div>
                `
            });
            console.log('✅ Email sent to:', email);
        } catch (mailError) {
            console.error('❌ Failed to send email:', mailError);
        }
    }
}

export async function registerPatient(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password || !phone) {
        return { message: 'All fields are required' };
    }

    // ── Server-side email domain validation ──
    const VALID_DOMAINS = [
        'gmail.com', 'yahoo.com', 'yahoo.co.id', 'hotmail.com', 'outlook.com',
        'live.com', 'icloud.com', 'me.com', 'protonmail.com', 'mail.com',
        'ymail.com', 'aol.com', 'msn.com', 'rocketmail.com',
    ];
    const TYPO_MAP: Record<string, string> = {
        'gamil.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmal.com': 'gmail.com',
        'gmial.com': 'gmail.com', 'gmil.com': 'gmail.com', 'gnail.com': 'gmail.com',
        'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com',
        'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
        'hotmial.com': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotmal.com': 'hotmail.com',
        'outloo.com': 'outlook.com', 'outlok.com': 'outlook.com',
    };
    const emailParts = email.split('@');
    if (emailParts.length !== 2) {
        return { message: 'Format email tidak valid.' };
    }
    const emailDomain = emailParts[1].toLowerCase();
    if (TYPO_MAP[emailDomain]) {
        return { message: `Domain email "${emailDomain}" tidak valid. Maksud kamu "${emailParts[0]}@${TYPO_MAP[emailDomain]}"?` };
    }
    if (!VALID_DOMAINS.includes(emailDomain)) {
        return { message: `Domain email "${emailDomain}" tidak dikenali. Gunakan email yang valid (contoh: @gmail.com, @yahoo.com).` };
    }
    // ── End validation ──

    try {
        const existing = await prisma.patient.findFirst({
            where: { email, password: { not: null } },
        });

        if (existing) {
            if (!existing.emailVerified) {
                const plainToken = Math.floor(100000 + Math.random() * 900000).toString();
                const expiresAt = Date.now() + 2 * 60 * 1000;
                const newToken = `${plainToken}_${expiresAt}`;
                await prisma.patient.update({
                    where: { id: existing.id },
                    data: { verificationToken: newToken }
                });

                await sendVerificationEmail(email, name, plainToken);

                return { success: true, requiresVerification: true, email };
            }
            return { message: 'Email already registered' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const plainToken = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000;
        const verificationToken = `${plainToken}_${expiresAt}`;

        const patient = await prisma.patient.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                verificationToken: verificationToken,
                emailVerified: false
            }
        });

        await sendVerificationEmail(email, name, plainToken);

        return {
            success: true,
            requiresVerification: true,
            email: patient.email
        };
    } catch (error) {
        console.error('Registration error:', error);
        return { message: 'An error occurred during registration' };
    }
}

export async function verifyRegistrationToken(email: string, token: string) {
    if (!email || !token) return { success: false, message: 'Invalid payload' };

    try {
        const patient = await prisma.patient.findFirst({ where: { email, password: { not: null } } });
        if (!patient) return { success: false, message: 'Account not found' };
        if (patient.emailVerified) return { success: true, message: 'Already verified' };
        
        if (!patient.verificationToken) {
            return { success: false, message: 'Invalid verification token' };
        }

        const [storedToken, expiresAt] = patient.verificationToken.split('_');

        if (storedToken !== token) {
            return { success: false, message: 'Invalid verification token' };
        }

        if (expiresAt && Date.now() > parseInt(expiresAt)) {
            return { success: false, message: 'Kode OTP sudah kadaluarsa (batas waktu 2 menit). Silakan daftar ulang.' };
        }

        await prisma.patient.updateMany({
            where: { email, password: { not: null } },
            data: { emailVerified: true, verificationToken: null }
        });

        const jwtToken = await new SignJWT({ id: patient.id, email: patient.email, name: patient.name, role: 'patient' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(key);

        cookies().set('patient_token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 
        });

        return { success: true, message: 'Verified successfully' };
    } catch(err) {
        return { success: false, message: 'Verification error' };
    }
}

export async function verifyPatientSession() {
    const token = cookies().get('patient_token')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload as { id: string, name: string, email: string, role: string };
    } catch (error) {
        return null;
    }
}

export async function logoutPatientAction() {
    cookies().delete('patient_token');
}

// --- Forgot Password ---
export async function forgotPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    if (!email) return { message: 'Email wajib diisi' };
    try {
        const patient = await prisma.patient.findFirst({ where: { email, password: { not: null } } });
        if (!patient) return { success: true, email };
        const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000;
        const otpWithExpiry = `${plainOtp}_${expiresAt}`;
        await prisma.patient.update({ where: { id: patient.id }, data: { verificationToken: otpWithExpiry } });
        await sendVerificationEmail(email, patient.name, plainOtp);
        return { success: true, email };
    } catch (err) {
        console.error('Forgot password error:', err);
        return { message: 'Terjadi kesalahan. Coba lagi.' };
    }
}

// --- Reset Password ---
export async function resetPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const otp = formData.get('otp') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    if (!email || !otp || !newPassword || !confirmPassword) return { message: 'Semua field wajib diisi' };
    if (newPassword !== confirmPassword) return { message: 'Password baru dan konfirmasi tidak sama' };
    if (newPassword.length < 6) return { message: 'Password minimal 6 karakter' };
    try {
        const patient = await prisma.patient.findFirst({ where: { email, password: { not: null } } });
        if (!patient) return { message: 'Akun tidak ditemukan' };
        if (!patient.verificationToken) return { message: 'Kode OTP salah atau sudah kadaluarsa' };
        const [storedOtp, expiresAt] = patient.verificationToken.split('_');
        if (storedOtp !== otp) return { message: 'Kode OTP salah' };
        if (expiresAt && Date.now() > parseInt(expiresAt)) return { message: 'Kode OTP sudah kadaluarsa (batas waktu 2 menit). Silakan ulangi "Forgot Password".' };
        const hashed = await bcrypt.hash(newPassword, 10);
        await prisma.patient.update({ where: { id: patient.id }, data: { password: hashed, verificationToken: null } });
        return { success: true };
    } catch (err) {
        console.error('Reset password error:', err);
        return { message: 'Terjadi kesalahan. Coba lagi.' };
    }
}
