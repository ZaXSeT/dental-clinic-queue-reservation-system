import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const doctors = [
        {
            name: 'Dr. Alexander Buygin',
            specialization: 'General Dentist',
            image: '/sarah_wilson.jpg', // Using existing assets based on booking page code
            availability: JSON.stringify({
                "MON": ["09:00 AM", "11:40 AM", "02:00 PM", "04:00 PM"],
                "TUE": ["09:00 AM", "10:00 AM", "03:00 PM"],
                "WED": ["11:00 AM", "01:00 PM"],
                "THU": ["09:00 AM", "12:00 PM", "04:00 PM"],
                "FRI": ["09:00 AM", "11:00 AM"],
                "SAT": [],
                "SUN": []
            })
        },
        {
            name: 'Dr. Dan Adler',
            specialization: 'General Dentist',
            image: '/dan_adler.png',
            availability: JSON.stringify({
                "MON": ["10:00 AM", "12:00 PM"],
                "TUE": [],
                "WED": ["09:00 AM", "11:00 AM"],
                "THU": ["09:00 AM", "12:00 PM", "05:00 PM"],
                "FRI": ["01:00 PM", "03:00 PM"],
                "SAT": ["10:00 AM"],
                "SUN": []
            })
        },
        {
            name: 'Dr. F. Khani',
            specialization: 'General Dentist',
            image: '/emily_parker.jpg',
            availability: JSON.stringify({
                "MON": ["02:00 PM", "04:00 PM"],
                "TUE": ["10:00 AM", "01:00 PM"],
                "WED": [],
                "THU": ["10:00 AM", "11:00 AM"],
                "FRI": ["09:00 AM", "12:00 PM"],
                "SAT": ["09:00 AM"],
                "SUN": []
            })
        }
    ];

    for (const doc of doctors) {
        const existing = await prisma.doctor.findFirst({ where: { name: doc.name } });
        if (!existing) {
            await prisma.doctor.create({ data: doc });
            console.log(`Created doctor: ${doc.name}`);
        } else {
            console.log(`Skipped existing doctor: ${doc.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
