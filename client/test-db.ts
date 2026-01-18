
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Testing Prisma Connection...');
    const count = await prisma.queue.count();
    console.log('Connection Successful! Queue count:', count);
}

main()
    .catch(e => {
        console.error('Connection Failed:', e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
