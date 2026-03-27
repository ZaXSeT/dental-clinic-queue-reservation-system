import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    // Just try fetching one patient to see what fields exist
    const sample = await prisma.patient.findFirst();
    if (sample) {
        console.log('Sample patient keys:', Object.keys(sample));
        console.log('Sample patient:', JSON.stringify(sample, null, 2));
    } else {
        console.log('No patients found in DB');
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
