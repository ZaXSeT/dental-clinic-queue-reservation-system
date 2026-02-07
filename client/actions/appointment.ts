'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { verifySession } from './auth';

export async function getAppointments() {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    noStore();
    try {
        const appointments = await prisma.appointment.findMany({
            orderBy: [
                { date: 'desc' },
                { time: 'asc' }
            ],
            include: {
                patient: true
            }
        });
        return { success: true, data: appointments };
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return { success: false, error: "Failed to fetch appointments" };
    }
}

export async function updateAppointmentStatus(id: string, status: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status }
        });

        // Sync Queue Status
        const queueDate = new Date(appointment.date);
        queueDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(queueDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const queueItem = await prisma.queue.findFirst({
            where: {
                patientId: appointment.patientId,
                date: {
                    gte: queueDate,
                    lt: nextDay
                }
            }
        });

        if (queueItem) {
            let queueStatus = 'waiting';
            if (status.toLowerCase() === 'completed') queueStatus = 'completed';
            else if (status.toLowerCase() === 'cancelled') queueStatus = 'cancelled';
            else if (status.toLowerCase() === 'confirmed') queueStatus = 'waiting';

            await prisma.queue.update({
                where: { id: queueItem.id },
                data: { status: queueStatus }
            });
        } else if (status.toLowerCase() !== 'cancelled') {
            const queueCount = await prisma.queue.count({
                where: {
                    date: {
                        gte: queueDate,
                        lt: nextDay
                    }
                }
            });

            await prisma.queue.create({
                data: {
                    number: queueCount + 1,
                    status: 'waiting',
                    patientId: appointment.patientId,
                    doctorId: (appointment as any).doctorID || (appointment as any).doctorId,
                    date: new Date(appointment.date),
                } as any
            });
        }

        revalidatePath('/admin/appointments');
        revalidatePath('/admin/dashboard');

        revalidatePath('/admin/appointments');
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Error updating appointment:", error);
        return { success: false, error: "Failed to update appointment" };
    }
}
