
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const appointments = await prisma.appointment.findMany();
    console.log("Total appointments:", appointments.length);
    appointments.forEach(app => {
        console.log(`- ID: ${app.id}, DateTime: ${app.dateTime}, Status: '${app.status}'`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
