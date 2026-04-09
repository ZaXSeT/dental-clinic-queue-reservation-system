















'use server';

import { prisma } from '@/lib/prisma';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key-change-this';
const key = new TextEncoder().encode(SECRET_KEY);

type UserRole = 'admin' | 'owner' | 'doctor';

export async function loginAction(
  prevState: any,
  formData: FormData
): Promise<{ message?: string; success?: boolean; data?: { name: string; role: UserRole; username: string } }> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { message: 'Please enter both username and password' };
  }

  try {
    const admin = await prisma.admin.findUnique({ where: { username } });
    const owner = await prisma.owner.findUnique({ where: { username } });
    const doctor = await prisma.doctor.findUnique({ where: { username } });

    const user =
      admin
        ? { ...admin, role: 'admin' as UserRole }
        : owner
        ? { ...owner, role: 'owner' as UserRole }
        : doctor
        ? { ...doctor, role: 'doctor' as UserRole }
        : null;

    if (!user || password !== user.password) {
      return { message: 'Invalid credentials' };
    }

    const token = await new SignJWT({ id: user.id, username: user.username, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(key);

    cookies().set('user_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return {
      success: true,
      data: {
        name: user.name,
        role: user.role,
        username: user.username,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { message: 'An error occurred during login' };
  }
}

export async function verifySession() {
  const token = cookies().get('user_token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] });
    return payload as { id: string; username: string; role: UserRole };
  } catch (error) {
    return null;
  }
}

export async function logoutAction() {
  cookies().delete('user_token');
}