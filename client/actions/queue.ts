'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { verifySession } from "./auth";
import { Queue, Patient, Doctor } from "@prisma/client";

type PopulatedQueue = Queue & {
    patient: Patient | null;
    doctor: Doctor | null;
};

export async function getQueueState() {
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

        // Sync appointments mapping for the just completed queues
        const recentlyCompleted = await prisma.queue.findMany({
            where: {
                date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
                status: 'completed',
                roomId: roomId,
                patientId: { not: null }
            }
        });

        for (const q of recentlyCompleted) {
            await prisma.appointment.updateMany({
                where: {
                    patientId: q.patientId as string,
                    date: q.date
                },
                data: { status: 'completed' }
            });
        }

        const updatedQueue = await prisma.queue.update({
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
        revalidatePath('/admin/portal/appointments');
        revalidatePath('/admin/portal/patients');
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
        const queue = await prisma.queue.update({
            where: { id },
            data: { status: 'completed' }
        });

        if (queue.patientId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            await prisma.appointment.updateMany({
                where: {
                    patientId: queue.patientId,
                    date: { gte: today }
                },
                data: { status: 'completed' }
            });
        }

        revalidatePath('/admin/queue');
        revalidatePath('/queue');
        revalidatePath('/dashboard');
        revalidatePath('/admin/portal/appointments');
        revalidatePath('/admin/portal/patients');
        return { success: true };
    } catch (e) {
        return { success: false };
    }
}

export async function skipPatient(id: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const queue = await prisma.queue.update({
            where: { id },
            data: { status: 'skipped' }
        });

        if (queue.patientId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            await prisma.appointment.updateMany({
                where: {
                    patientId: queue.patientId,
                    date: { gte: today }
                },
                data: { status: 'cancelled' }
            });
        }

        revalidatePath('/admin/queue');
        revalidatePath('/admin/portal/appointments');
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

    // 1. Find or create patient
    let patient = null;
    if (phone) {
        patient = await prisma.patient.findFirst({ where: { phone } });
    }
    
    if (!patient) {
        // Create new patient using a generated username if both info doesn't exist
        const safeUsername = `walkin_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const bcrypt = require('bcryptjs');
        const defaultPassword = await bcrypt.hash('walkin123', 10);
        
        patient = await prisma.patient.create({
            data: {
                name: name,
                phone: phone,
                username: safeUsername,
                password: defaultPassword,
                address: 'Walk-In Patient',
                medicalHistory: 'Walk-In Registration',
            }
        });
    }

    // 2. Add Queue and link to Patient
    const newQueue = await prisma.queue.create({
        data: {
            number: nextNumber,
            name: name,
            phone: phone,
            status: 'waiting',
            date: new Date(),
            patientId: patient.id
        }
    });

    // 3. Create Appointment for today so it syncs with patient history and dashboard
    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    await prisma.appointment.create({
        data: {
            patientId: patient.id,
            date: today,
            time: timeString,
            status: 'scheduled',
            treatment: 'Walk-In Request',
            notes: 'Created from Queue Control Walk-In'
        }
    });

    revalidatePath('/admin/queue');
    revalidatePath('/admin/portal/appointments');
    revalidatePath('/admin/portal/patients');
    revalidatePath('/admin/portal/dashboard');
    return { success: true };
}
