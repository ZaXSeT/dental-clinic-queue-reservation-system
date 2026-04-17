'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './auth';
import nodemailer from 'nodemailer';

export async function createContactMessage(data: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    // 1. Save to DB
    const result = await prisma.contactMessage.create({ data });
    console.log('✅ Message saved to DB:', result);

    // 2. Send email notification to clinic
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Go Dental Contact Form" <${process.env.SMTP_USER}>`,
      to: 'zackyxieantigravity1@gmail.com',
      replyTo: data.email,
      subject: `New Inquiry from ${data.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 12px;">
          <h2 style="color: #009ae2; margin-bottom: 4px;">New Contact Message</h2>
          <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Someone submitted a message through the Go Dental website.</p>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #334155; width: 30%;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #334155;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0; color: #475569;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: bold; color: #334155; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #475569; white-space: pre-line;">${data.message}</td>
            </tr>
          </table>
          <p style="margin-top: 24px; font-size: 12px; color: #94a3b8;">You can reply directly to this email to respond to ${data.name}.</p>
        </div>
      `,
    });

    console.log('✅ Email notification sent to clinic');
    return result;
  } catch (err) {
    console.error('❌ Error in createContactMessage:', err);
    throw err;
  }
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
