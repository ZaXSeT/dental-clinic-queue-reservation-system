'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { verifySession } from './auth';
import { revalidatePath } from 'next/cache';

export async function createAdminAccount(data: { name: string, username: string, password: string, role: string }) {
    const session = await verifySession();
    if (!session || session.role !== 'owner') {
        return { success: false, error: "Unauthorized. Only Owners can create accounts." };
    }

    try {
        const existing = await prisma.admin.findUnique({ where: { username: data.username } });
        if (existing) return { success: false, error: "Username already exists." };

        const hashedPassword = await bcrypt.hash(data.password, 10);
        await prisma.admin.create({
            data: {
                name: data.name,
                username: data.username,
                password: hashedPassword,
                role: data.role || 'admin'
            }
        });

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error("Failed to create admin:", error);
        return { success: false, error: "Database error." };
    }
}

export async function createDoctorAccount(data: { name: string, specialization: string, image?: string, availability: string }) {
    const session = await verifySession();
    if (!session || session.role !== 'owner') {
        return { success: false, error: "Unauthorized. Only Owners can add doctors." };
    }

    try {
        await prisma.doctor.create({
            data: {
                name: data.name,
                specialization: data.specialization,
                image: data.image || '/default-doctor.jpg',
                availability: data.availability
            }
        });

        revalidatePath('/admin/doctors');
        return { success: true };
    } catch (error) {
        console.error("Failed to create doctor:", error);
        return { success: false, error: "Database error." };
    }
}

export async function getBillingData() {
    const session = await verifySession();
    if (!session || session.role !== 'owner') {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const invoices = await prisma.invoice.findMany({
            include: { patient: true, items: true },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        const stats = await prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'paid' }
        });

        const pending = await prisma.invoice.aggregate({
            _sum: { totalAmount: true },
            where: { status: 'unpaid' }
        });

        const clinic = await prisma.clinicSettings.findFirst();

        return {
            success: true,
            data: {
                stats: {
                    totalRevenue: `Rp ${(stats._sum.totalAmount || 0).toLocaleString('id-ID')}`,
                    pendingPayments: `Rp ${(pending._sum.totalAmount || 0).toLocaleString('id-ID')}`,
                    paidToday: "Rp 0",
                    taxID: `NPWP: ${clinic?.npwp || '01.234.567.8-901.000'}`
                },
                invoices: invoices.map((inv: any) => ({
                    id: inv.invoiceNumber,
                    dbId: inv.id,
                    patient: inv.patient.name,
                    treatment: inv.items[0]?.description || "General Visit",
                    amount: `Rp ${inv.totalAmount.toLocaleString('id-ID')}`,
                    status: inv.status === 'paid' ? 'Paid' : 'Pending',
                    billingCode: inv.billingCode
                }))
            }
        };
    } catch (error) {
        console.error("Failed to fetch billing:", error);
        return { success: false, error: "Database error" };
    }
}
