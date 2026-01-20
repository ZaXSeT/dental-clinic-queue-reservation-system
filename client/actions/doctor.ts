'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAllDoctors() {
    try {
        const doctors = await prisma.doctor.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: doctors };
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return { success: false, error: "Failed to fetch doctors" };
    }
}

export async function updateDoctorAvailability(doctorId: string, availability: any) {
    try {
        const availabilityString = JSON.stringify(availability);

        await prisma.doctor.update({
            where: { id: doctorId },
            data: { availability: availabilityString }
        });

        revalidatePath('/admin/doctors');
        revalidatePath('/booking');
        return { success: true };
    } catch (error) {
        console.error("Error updating doctor schedule:", error);
        return { success: false, error: "Failed to update schedule" };
    }
}
