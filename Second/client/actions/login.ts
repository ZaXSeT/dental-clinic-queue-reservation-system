'use server';

import { prisma } from '@/lib/prisma';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { success: false, message: 'Please enter username and password' };
  }

  try {
    const user = await prisma.admin.findUnique({
      where: { username },
    });

    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Plain text comparison (NOT secure)
    if (password !== user.password) {
      return { success: false, message: 'Invalid credentials' };
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Login failed' };
  }
}