'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getQueueState() {
    console.log("getQueueState called (BRUTE FORCE FETCH)");

    try {
        // 1. Fetch EVERYTHING recently created (bypass DB filters)
        const allRecentQueues = await prisma.queue.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: true,
                doctor: true
            }
        });

        console.log(`Fetched ${allRecentQueues.length} raw records.`);

        // 2. Filter manually in memory
        // Active: treating or called
        const activeQueues = allRecentQueues
            .filter((q: any) => ['treating', 'called', 'TREATING', 'CALLED'].includes(q.status))
            .sort((a: any, b: any) => (Number(a.roomId) || 99) - (Number(b.roomId) || 99)); // Sort by room ID

        // Waiting: waiting
        const waitingQueues = allRecentQueues
            .filter((q: any) => ['waiting', 'WAITING'].includes(q.status))
            .sort((a: any, b: any) => a.number - b.number); // Sort by queue number

        // Take top 7 for UI
        const nextHelper = waitingQueues.slice(0, 7);

        // Get total count (this one we can ask DB safely, or just use length if it's small)
        // Let's rely on DB count for total accuracy
        const waitingCountSource = await prisma.queue.count({
            where: { status: { in: ['waiting', 'WAITING'] } }
        });
        const waitingCount = waitingCountSource || waitingQueues.length;

        console.log(`Memory Filtered: Active=${activeQueues.length}, WaitingList=${waitingQueues.length}`);

        revalidatePath('/admin/queue'); // Force cache refresh

        return { activeQueues, next: nextHelper, waitingCount, error: null };
    } catch (error: any) {
        console.error("getQueueState CRITICAL ERROR:", error);
        return {
            activeQueues: [],
            next: [],
            waitingCount: 0,
            error: "Server Error: " + (error.message || String(error))
        };
    }
}

export async function callNextPatient(roomId: string, doctorId?: string) {
    // Get the next waiting patient
    const nextPatient = await prisma.queue.findFirst({
        where: {
            status: { in: ['waiting', 'WAITING'] }
        },
        orderBy: { number: 'asc' }
    });

    if (!nextPatient) return { success: false, message: "No patients waiting" };

    try {
        // Complete any PREVIOUS patient in THIS specific room
        await prisma.queue.updateMany({
            where: {
                date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // Keep date filter for completing previous patients
                status: { in: ['treating', 'called', 'TREATING', 'CALLED'] },
                roomId: roomId
            },
            data: { status: 'completed' }
        });

        // Assign next patient to this Room & Doctor
        await prisma.queue.update({
            where: { id: nextPatient.id },
            data: {
                status: 'treating',
                updatedAt: new Date(),
                roomId: roomId,
                doctorId: doctorId || null // Optional if not provided
            }
        });

        revalidatePath('/admin/queue');
        revalidatePath('/queue');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (error) {
        return { success: false, error };
    }
}

export async function recallPatient(id: string) {
    try {
        await prisma.queue.update({
            where: { id },
            data: { updatedAt: new Date() }
        });
        revalidatePath('/admin/queue');
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function completePatient(id: string) {
    try {
        await prisma.queue.update({
            where: { id },
            data: { status: 'completed' }
        });
        revalidatePath('/admin/queue');
        revalidatePath('/queue');
        revalidatePath('/dashboard');
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function skipPatient(id: string) {
    try {
        await prisma.queue.update({
            where: { id },
            data: { status: 'skipped' } // Or move to end?
        });
        revalidatePath('/admin/queue');
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function resetQueue() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Dangerous action: Cancel all today's queues or delete?
    // Let's just set all waiting to cancelled or delete them.
    // For a "Reset" typically means clearing for testing. 
    // Let's just delete today's queues for now.
    await prisma.queue.deleteMany({
        where: { date: { gte: today } }
    });

    revalidatePath('/admin/queue');
    return { success: true };
}

export async function addWalkIn(name: string, phone: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get max number
    const lastQ = await prisma.queue.findFirst({
        where: { date: { gte: today } },
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastQ?.number || 0) + 1;

    await prisma.queue.create({
        data: {
            number: nextNumber,
            name: name, // Guest name
            phone: phone,
            status: 'waiting',
            date: new Date(),
        }
    });

    revalidatePath('/admin/queue');
    return { success: true };
}
