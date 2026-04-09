
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("Checking appointments where date >= ", today);

    const appointments = await prisma.appointment.findMany({
        where: { dateTime: { gte: today } }
    });

    console.log("Total matched in Dashboard Query (date >= today):", appointments.length);
    appointments.forEach(app => {
        console.log(`- ID: ${app.id}, DateTime: ${app.dateTime.toISOString()}, Status: '${app.status}'`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
