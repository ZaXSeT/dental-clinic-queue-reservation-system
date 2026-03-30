import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Deleting Dr Jane...");
    const res = await prisma.doctor.deleteMany({
        where: {
            name: {
                contains: 'Jane',
            }
        }
    });
    console.log("Deleted count:", res.count);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
