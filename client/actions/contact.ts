'use server';

import { prisma } from '@/lib/prisma';

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const result = await prisma.contactMessage.create({ data });
    console.log('✅ Message saved to DB:', result); // <-- ADD THIS
    return result;
  } catch (err) {
    console.error('❌ Prisma error:', err); // <-- ADD THIS
    throw err;
  }
  //return prisma.contactMessage.create({ data });
  console.log('Message would be send: ', data);
  return {success: true};
}

// mark as replied
export async function markMessageAsReplied(messageId: string, admin: string) {
  return prisma.contactMessage.update({
    where: { id: messageId },
    data: { replied: true, repliedBy: admin },
  });
}


export async function getAllContactMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });
}
