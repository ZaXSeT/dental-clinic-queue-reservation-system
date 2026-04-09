'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from './auth';
import { revalidatePath } from 'next/cache';

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
                    select: {
                        appointments: {
                            where: { status: 'completed' }
                        }
                    }
                },
                appointments: {
                    orderBy: { date: 'desc' },
                    where: { status: { not: 'cancelled' } },
                    take: 1,
                    select: { date: true, time: true, status: true, notes: true, doctor: { select: { name: true } } }
                }
            }
        });

        return { success: true, data: patients };
    } catch (error) {
        console.error("Error fetching patients:", error);
        return { success: false, error: "Failed to fetch patients" };
    }
}

export async function deletePatient(id: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await prisma.queue.deleteMany({ where: { patientId: id } });
        // Make sure to delete related invoices that point to appointments we are about to delete
        const appts = await prisma.appointment.findMany({ where: { patientId: id }, select: { id: true } });
        const apptIds = appts.map(a => a.id);
        if (apptIds.length > 0) {
            await prisma.invoice.deleteMany({ where: { appointmentId: { in: apptIds } } });
        }
        await prisma.appointment.deleteMany({ where: { patientId: id } });
        await prisma.patient.delete({ where: { id } });
        revalidatePath('/staff/portal/patients');
        return { success: true };
    } catch (error) {
        console.error("Error deleting patient:", error);
        return { success: false, error: "Failed to delete patient" };
    }
}

export async function updatePatientName(id: string, name: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await prisma.patient.update({ where: { id }, data: { name } });
        revalidatePath('/staff/portal/patients');
        return { success: true };
    } catch (error) {
        console.error("Error updating patient:", error);
        return { success: false, error: "Failed to update patient" };
    }
}
