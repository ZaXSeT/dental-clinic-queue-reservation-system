// // @/actions/register.ts
// 'use server';

// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs';

// export async function registerAction(prevState: any, formData: FormData) {
//   const name = formData.get('name') as string;
//   const username = formData.get('username') as string;
//   const password = formData.get('password') as string;
//   const email = formData.get('email') as string | null;

//   if (!name || !username || !password) {
//     return { success: false, message: 'All fields are required' };
//   }

//   try {
//     const existing = await prisma.patient.findUnique({ where: { username } });
//     if (existing) {
//       return { success: false, message: 'Username already exists' };
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const patient = await prisma.patient.create({
//       data: {
//         name,
//         username,
//         email: email || null,
//         password: hashedPassword,
//       },
//     });

//     // Return success AND user data so useFormState works
//     return {
//       success: true,
//       message: 'Account created successfully',
//       data: {
//         id: patient.id,
//         name: patient.name,
//         username: patient.username,
//       },
//     };
//   } catch (error) {
//     console.error(error);
//     return { success: false, message: 'Signup failed' };
//   }
// }