import { PrismaClient } from '@prisma/client';

let url = process.env.DATABASE_URL;
if (url && !url.includes('pgbouncer=true')) {
    url += url.includes('?') ? '&pgbouncer=true' : '?pgbouncer=true';
}

const prisma = new PrismaClient({
    datasources: {
        db: {
            url,
        },
    },
});

async function main() {
    console.log('Removing dummy patients and appointments...');

    const dummyUsernames = [
        'ahmadfauzi',
        'sitirahayu',
        'budisantoso',
        'dewilestari',
        'rikopratama',
        'rinawulandari',
        'hendragunawan',
        'nurhidayah'
    ];

    // Find patients
    const patients = await prisma.patient.findMany({
        where: {
            username: {
                in: dummyUsernames
            }
        }
    });

    const patientIds = patients.map(p => p.id);

    if (patientIds.length > 0) {
        // Delete appointments first
        const deletedAppointments = await prisma.appointment.deleteMany({
            where: {
                patientId: {
                    in: patientIds
                }
            }
        });
        console.log(`Deleted ${deletedAppointments.count} dummy appointments.`);

        // Delete patients
        const deletedPatients = await prisma.patient.deleteMany({
            where: {
                id: {
                    in: patientIds
                }
            }
        });
        console.log(`Deleted ${deletedPatients.count} dummy patients.`);
    } else {
        console.log('No dummy patients found.');
    }

    console.log('Done!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
