'use server'

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

export async function loginAction(prevState: any, formData: FormData): Promise<{ message?: string; success?: boolean }> {
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
        });

        return { success: true };
    } catch (error) {
        console.error('Login error:', error);
        return { message: 'An error occurred during login' };
    }
}

export async function logoutAction() {
    cookies().delete('admin_token');
}
