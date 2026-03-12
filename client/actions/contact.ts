'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './auth';

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const result = await prisma.contactMessage.create({ data });
    console.log('✅ Message saved to DB:', result); 
    return result;
  } catch (err) {
    console.error('❌ Prisma error:', err); 
    throw err;
  }
  
  console.log('Message would be send: ', data);
  return { success: true };
}


export async function markMessageAsReplied(messageId: string, admin: string) {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  return prisma.contactMessage.update({
    where: { id: messageId },
    data: { replied: true, repliedBy: admin },
  });
}


export async function getAllContactMessages() {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
