import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

let url = process.env.DATABASE_URL;
if (url && !url.includes('pgbouncer=true')) {
    url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
}

const prisma = new PrismaClient({
    datasources: { db: { url } },
});

async function main() {
    console.log('Syncing old queue data with patient and appointment records...');

    // Find all Queues that don't have a linked patient
    const orphanedQueues = await prisma.queue.findMany({
        where: { patientId: null }
    });

    console.log(`Found ${orphanedQueues.length} queue records without a linked patient.`);

    const defaultPassword = await bcrypt.hash('walkin123', 10);

    for (const q of orphanedQueues) {
        if (!q.name) continue;

        let patient = null;

        // Try to find patient by phone first
        if (q.phone) {
            patient = await prisma.patient.findFirst({ where: { phone: q.phone } });
        }
        
        // Try by name if still not found
        if (!patient) {
            patient = await prisma.patient.findFirst({ where: { name: q.name } });
        }

        // If no patient exists, create one
        if (!patient) {
            const safeUsername = `walkin_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            patient = await prisma.patient.create({
                data: {
                    name: q.name || 'Unknown Patient',
                    phone: q.phone || '',
                    username: safeUsername,
                    password: defaultPassword,
                    address: 'Walk-In Patient (Migrated)',
                    medicalHistory: 'Walk-In Registration',
                }
            });
            console.log(`Created new patient profile for: ${q.name}`);
        } else {
            console.log(`Found existing patient for: ${q.name}`);
        }

        // Update the Queue to link to this patient
        await prisma.queue.update({
            where: { id: q.id },
            data: { patientId: patient.id }
        });

        // ----------------------------------------------------
        // Sync to Appointment
        // ----------------------------------------------------
        // Check if an appointment exists for this patient on this specific date
        // Note: Queue 'date' might be a full DateTime, so we use startOfDay and endOfDay
        const qDate = new Date(q.date);
        const startOfDay = new Date(qDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(qDate);
        endOfDay.setHours(23, 59, 59, 999);

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                patientId: patient.id,
                date: { gte: startOfDay, lte: endOfDay }
            }
        });

        let apptStatus = 'scheduled';
        if (q.status === 'completed' || ['TREATING', 'CALLED', 'treating', 'called'].includes(q.status)) apptStatus = 'completed';
        if (q.status === 'skipped') apptStatus = 'cancelled';

        if (!existingAppointment) {
            const timeString = `${q.createdAt.getHours().toString().padStart(2, '0')}:${q.createdAt.getMinutes().toString().padStart(2, '0')}`;
            
            await prisma.appointment.create({
                data: {
                    patientId: patient.id,
                    date: startOfDay,
                    time: timeString,
                    status: apptStatus,
                    treatment: 'Walk-In Request (Migrated)',
                    notes: 'Auto-synced from historical Queue entry'
                }
            });
            console.log(`Created missed Appointment for ${q.name} on ${startOfDay.toISOString().split('T')[0]} (Status: ${apptStatus})`);
        } else {
             // Just update the status if it already exists but queue status changed
             await prisma.appointment.update({
                 where: { id: existingAppointment.id },
                 data: { status: apptStatus }
             });
             console.log(`Updated existing Appointment status for ${q.name} to ${apptStatus}`);
        }
    }

    console.log('Sync complete!');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
