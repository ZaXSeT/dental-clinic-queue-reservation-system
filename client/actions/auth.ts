'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

export async function loginAction(prevState: any, formData: FormData): Promise<{ message?: string; success?: boolean; data?: { name: string, role: string, username: string } }> {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (!username || !password) {
        return { message: 'Please enter both username and password' };
    }

    try {
        const admin = await prisma.admin.findUnique({
            where: { username },
        });

        if (!admin) {
            return { message: 'Invalid credentials' };
        }

        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return { message: 'Invalid credentials' };
        }

        const token = await new SignJWT({ id: admin.id, username: admin.username, role: admin.role })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('24h')
            .sign(key);

        cookies().set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60 * 24 // 24 hours
        });

        return {
            success: true,
            data: {
                name: admin.name,
                role: admin.role,
                username: admin.username
            }
        };
    } catch (error) {
        console.error('Login error:', error);
        return { message: 'An error occurred during login' };
    }
}

export async function verifySession() {
    const token = cookies().get('admin_token')?.value;
    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        return payload as { id: string, username: string, role: string };
    } catch (error) {
        return null;
    }
}

export async function logoutAction() {
    cookies().delete('admin_token');
}
