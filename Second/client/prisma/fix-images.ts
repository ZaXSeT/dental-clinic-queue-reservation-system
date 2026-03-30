import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing doctor images...');

    const updates = [
        { name: 'Dr. Alexander Buygin', image: '/sarah_wilson.jpg' },
        { name: 'Dr. Dan Adler', image: '/dan_adler.png' },
        { name: 'Dr. F. Khani', image: '/emily_parker.jpg' },
    ];

    for (const update of updates) {
        await prisma.doctor.updateMany({
            where: { name: update.name },
            data: { image: update.image },
        });
        console.log(`Updated image for ${update.name} to ${update.image}`);
    }

    console.log('Done.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
