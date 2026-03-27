import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fixing doctor schedules...');

    const updates = [
        {
            name: 'Dr. Alexander Buygin',
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

    for (const update of updates) {
        const result = await prisma.doctor.updateMany({
            where: { name: update.name },
            data: { availability: update.availability },
        });
        console.log(`Updated schedule for ${update.name} (${result.count} row(s) updated)`);
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
