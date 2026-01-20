'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

export async function getQueueState() {
    console.log("getQueueState called (BRUTE FORCE FETCH)");

    try {
        const allRecentQueues = await prisma.queue.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: true,
                doctor: true
            }
        });

        console.log(`Fetched ${allRecentQueues.length} raw records.`);

        const activeQueues = allRecentQueues
            .filter((q: any) => ['treating', 'called', 'TREATING', 'CALLED'].includes(q.status))
            .sort((a: any, b: any) => (Number(a.roomId) || 99) - (Number(b.roomId) || 99));

        const waitingQueues = allRecentQueues
            .filter((q: any) => ['waiting', 'WAITING'].includes(q.status))
            .sort((a: any, b: any) => a.number - b.number);

        const nextHelper = waitingQueues.slice(0, 7);

        const waitingCountSource = await prisma.queue.count({
            where: { status: { in: ['waiting', 'WAITING'] } }
        });
        const waitingCount = waitingCountSource || waitingQueues.length;

        console.log(`Memory Filtered: Active=${activeQueues.length}, WaitingList=${waitingQueues.length}`);

        revalidatePath('/admin/queue');

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
    const nextPatient = await prisma.queue.findFirst({
        where: {
            status: { in: ['waiting', 'WAITING'] }
        },
        orderBy: { number: 'asc' }
    });

    if (!nextPatient) return { success: false, message: "No patients waiting" };

    try {
        await prisma.queue.updateMany({
            where: {
                date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: { in: ['treating', 'called', 'TREATING', 'CALLED'] },
                roomId: roomId
            },
            data: { status: 'completed' }
        });

        await prisma.queue.update({
            where: { id: nextPatient.id },
            data: {
                status: 'treating',
                updatedAt: new Date(),
                roomId: roomId,
                doctorId: doctorId || null
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
            data: { status: 'skipped' }
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

    await prisma.queue.deleteMany({
        where: { date: { gte: today } }
    });

    revalidatePath('/admin/queue');
    return { success: true };
}

export async function addWalkIn(name: string, phone: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastQ = await prisma.queue.findFirst({
        where: { date: { gte: today } },
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastQ?.number || 0) + 1;

    await prisma.queue.create({
        data: {
            number: nextNumber,
            name: name,
            phone: phone,
            status: 'waiting',
            date: new Date(),
        }
    });

    revalidatePath('/admin/queue');
    return { success: true };
}
