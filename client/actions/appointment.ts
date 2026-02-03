'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';

export async function getAppointments() {
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
    try {
        await prisma.appointment.update({
            where: { id },
            data: { status }
        });
        revalidatePath('/admin/appointments');
        return { success: true };
    } catch (error) {
        console.error("Error updating appointment:", error);
        return { success: false, error: "Failed to update appointment" };
    }
}
