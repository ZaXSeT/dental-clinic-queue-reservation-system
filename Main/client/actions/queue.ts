'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";
import { verifySession } from "./auth";
import { Queue, Patient, Doctor } from "@prisma/client";

type PopulatedQueue = Queue & {
    patient: Patient | null;
    doctor: Doctor | null;
};

export async function getQueueState() {
    noStore();
    try {
        const allRecentQueues: PopulatedQueue[] = await prisma.queue.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: true,
                doctor: true
            }
        });

        const activeStatuses = ['treating', 'called', 'TREATING', 'CALLED'];
        const activeQueues = allRecentQueues
            .filter(q => activeStatuses.includes(q.status))
            .sort((a, b) => (Number(a.roomId) || 99) - (Number(b.roomId) || 99));

        const waitingStatuses = ['waiting', 'WAITING'];
        const waitingQueues = allRecentQueues
            .filter(q => waitingStatuses.includes(q.status))
            .sort((a, b) => a.number - b.number);

        const waitingCountSource = await prisma.queue.count({
            where: { status: { in: waitingStatuses } }
        });

        const nextHelper = waitingQueues.slice(0, 10);
        const totalWaiting = waitingCountSource || waitingQueues.length;

        revalidatePath('/admin/queue');

        return { activeQueues, next: nextHelper, waitingCount: totalWaiting, error: null };
    } catch (error) {
        console.error("getQueueState CRITICAL ERROR:", error);
        return {
            activeQueues: [],
            next: [],
            waitingCount: 0,
            error: "Server Error: " + (error instanceof Error ? error.message : String(error))
        };
    }
}

export async function callNextPatient(roomId: string, doctorId?: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

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
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

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
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

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
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

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
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await prisma.queue.deleteMany({
        where: { date: { gte: today } }
    });

    revalidatePath('/admin/queue');
    return { success: true };
}

export async function addWalkIn(name: string, phone: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

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

export async function bookQueuePatient(doctorId?: string) {
    const { verifyPatientSession } = await import('./patientAuth');
    const session = await verifyPatientSession();
    if (!session) return { success: false, error: "Unauthorized: Please login first." };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await prisma.queue.findFirst({
        where: { 
            patientId: session.id,
            date: { gte: today },
            status: { in: ['waiting', 'treating', 'WAITING', 'TREATING'] }
        }
    });

    if (existing) {
        return { success: false, error: "You already have an active queue for today." };
    }

    const lastQ = await prisma.queue.findFirst({
        where: { date: { gte: today } },
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastQ?.number || 0) + 1;

    await prisma.queue.create({
        data: {
            number: nextNumber,
            patientId: session.id,
            name: session.name,
            status: 'waiting',
            date: new Date(),
            doctorId: doctorId || null
        }
    });

    revalidatePath('/queue');
    revalidatePath('/admin/queue');
    return { success: true, queueNumber: nextNumber };
}
