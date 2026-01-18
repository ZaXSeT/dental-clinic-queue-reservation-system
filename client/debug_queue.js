
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log("--- DEBUGGER STARTED ---");
    console.log("Server Time (Local):", new Date().toString());
    console.log("Filter Date (gte):", today.toString());
    console.log("Filter Date (ISO):", today.toISOString());

    console.log("\nSearching for queues created strictly AFTER:", today.toISOString());

    const allQueuesToday = await prisma.queue.findMany({
        where: {
            date: {
                gte: today
            }
        }
    });

    console.log(`\nFound ${allQueuesToday.length} queues for TODAY (any status):`);

    allQueuesToday.forEach(q => {
        console.log(`[${q.status}] #${q.number} Name: ${q.name || 'Guest'} | ID: ${q.id} | Date: ${q.date.toISOString()}`);
    });

    const exactWaiting = await prisma.queue.findMany({
        where: {
            date: { gte: today },
            status: { in: ['waiting', 'WAITING'] }
        }
    });

    console.log(`\nFound ${exactWaiting.length} queues with status 'waiting' OR 'WAITING':`);
    exactWaiting.forEach(q => console.log(` - #${q.number} ${q.name}`));

    console.log("--- DEBUGGER END ---");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
