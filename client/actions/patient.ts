'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './auth';

export async function getPatients() {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const patients = await prisma.patient.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: { appointments: true }
                },
                appointments: {
                    take: 1,
                    orderBy: { date: 'desc' },
                    select: { date: true }
                }
            }
        });

        return { success: true, data: patients };
    } catch (error) {
        console.error("Error fetching patients:", error);
        return { success: false, error: "Failed to fetch patients" };
    }
}
