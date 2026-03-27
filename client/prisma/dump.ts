import { PrismaClient } from '@prisma/client';

let url = process.env.DATABASE_URL;
if (url && !url.includes('pgbouncer=true')) {
    url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
}

const prisma = new PrismaClient({
    datasources: { db: { url } },
});

async function main() {
    const patients = await prisma.patient.findMany();
    const appointments = await prisma.appointment.findMany();
    const queues = await prisma.queue.findMany();

    console.log(`\nPatients (${patients.length}):`);
    patients.forEach(p => console.log(`- ID: ${p.id}, Name: ${p.name}, Username: ${p.username}, Phone: ${p.phone}`));

    console.log(`\nAppointments (${appointments.length}):`);
    appointments.forEach(a => console.log(`- ID: ${a.id}, PatientId: ${a.patientId}, Date: ${a.date}, Status: ${a.status}`));

    console.log(`\nQueues (${queues.length}):`);
    queues.forEach(q => console.log(`- ID: ${q.id}, Name: ${q.name}, Phone: ${q.phone}, PatientId: ${q.patientId}, Status: ${q.status}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
