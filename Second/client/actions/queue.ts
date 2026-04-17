'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_noStore } from "next/cache";
import { verifySession } from "./auth";
import { Queue, Patient, Doctor } from "@prisma/client";

type PopulatedQueue = Queue & {
    patient: Patient | null;
    doctor: Doctor | null;
};

export async function getQueueState() {
    unstable_noStore();
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const allRecentQueues: PopulatedQueue[] = await prisma.queue.findMany({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow
                }
            },
            take: 50,
            orderBy: { createdAt: 'desc' },
            include: {
                patient: {
                    include: {
                        appointments: {
                            where: { status: { not: 'cancelled' } },
                            orderBy: { date: 'desc' },
                            take: 1
                        }
                    }
                },
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
            where: { 
                status: { in: waitingStatuses },
                date: { gte: today, lt: tomorrow }
            }
        });

        const nextHelper = waitingQueues.slice(0, 10);
        const totalWaiting = waitingCountSource || waitingQueues.length;

        revalidatePath('/staff/queue');

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

    const waitingStatuses = ['waiting', 'WAITING'];

    const allWaiting = await prisma.queue.findMany({
        where: { status: { in: waitingStatuses } },
        include: {
            patient: {
                include: {
                    appointments: {
                        where: {
                            status: { not: 'cancelled' },
                            date: {
                                gte: new Date(new Date().setHours(0, 0, 0, 0)),
                                lt: new Date(new Date().setHours(23, 59, 59, 999)),
                            }
                        },
                        orderBy: { time: 'asc' },
                        take: 1,
                    }
                }
            }
        },
        orderBy: { number: 'asc' }
    });

    if (allWaiting.length === 0) return { success: false, message: "No patients waiting" };

    let nextPatient = null;

    if (doctorId) {
        const forThisDoctor = allWaiting.filter(q => q.doctorId === doctorId);

        const withAppointment = forThisDoctor.filter(q =>
            q.patient?.appointments && q.patient.appointments.length > 0
        );

        if (withAppointment.length > 0) {
            withAppointment.sort((a, b) => {
                const tA = a.patient?.appointments?.[0]?.time || '99:99';
                const tB = b.patient?.appointments?.[0]?.time || '99:99';
                return tA.localeCompare(tB);
            });
            nextPatient = withAppointment[0];
        }

        if (!nextPatient && forThisDoctor.length > 0) {
            nextPatient = forThisDoctor[0];
        }
    }

    if (!nextPatient) {
        const anyDoctor = allWaiting.filter(q => !q.doctorId);
        if (anyDoctor.length > 0) {
            nextPatient = anyDoctor[0];
        }
    }

    if (!nextPatient) {
        return {
            success: false,
            message: "No eligible patients for this doctor. Patients in queue have requested a different doctor."
        };
    }

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
                doctorId: doctorId || nextPatient.doctorId || null
            }
        });

        revalidatePath('/staff/queue');
        revalidatePath('/queue');
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
        revalidatePath('/staff/queue');
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
        revalidatePath('/staff/queue');
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
        revalidatePath('/staff/queue');
    } catch (e) {
        return { success: false };
    }
}

export async function removePatientFromQueue(id: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const queueEntry = await prisma.queue.findUnique({ where: { id } });
        if (!queueEntry) return { success: false, error: "Not found" };

        if (queueEntry.patientId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            await prisma.appointment.updateMany({
                where: {
                    patientId: queueEntry.patientId,
                    date: {
                        gte: today,
                        lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                    },
                    status: 'scheduled'
                },
                data: { status: 'cancelled' }
            });
        }

        await prisma.queue.delete({ where: { id } });
        
        revalidatePath('/staff/queue');
        revalidatePath('/queue');
        revalidatePath('/booking'); // refresh slot availability on booking page
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
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    await prisma.queue.deleteMany({
        where: { 
            date: { gte: today, lt: tomorrow } 
        }
    });

    await prisma.appointment.deleteMany({
        where: {
            date: { gte: today, lt: tomorrow },
            status: { in: ['scheduled', 'cancelled'] }
        }
    });

    revalidatePath('/staff/queue');
    revalidatePath('/booking');
    return { success: true };
}

export async function addWalkIn(name: string, phone: string, doctorId?: string, time?: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (doctorId && time) {
        const slotTaken = await prisma.appointment.findFirst({
            where: {
                doctorID: doctorId,
                date: {
                    gte: today,
                    lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
                },
                time: time,
                status: { not: "cancelled" }
            }
        });
        
        if (slotTaken) {
            return { success: false, error: "Slot already booked by another patient" };
        }
    }

    const lastQ = await prisma.queue.findFirst({
        where: { date: { gte: today } },
        orderBy: { number: 'desc' }
    });
    const nextNumber = (lastQ?.number || 0) + 1;

    const q = await prisma.queue.create({
        data: {
            number: nextNumber,
            name: name,
            phone: phone,
            status: 'waiting',
            date: new Date(),
            doctorId: doctorId || null,
        }
    });

    if (doctorId && time) {


        let p = await prisma.patient.findFirst({ where: { name } });
        if (!p) {
            p = await prisma.patient.create({ data: { name, phone } });
        }
        
        await prisma.appointment.create({
            data: {
                date: today,
                time: time,
                status: "scheduled",
                patientId: p.id,
                doctorID: doctorId,
                treatment: "Walk-In"
            }
        });
    }

    revalidatePath('/staff/queue');
    return { success: true };
}

