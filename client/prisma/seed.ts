const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

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
    console.log('Seeding database...');

    const doctors = [
        {
            name: 'Dr. Alexander Buygin',
            specialization: 'General Dentist',
            image: '/sarah_wilson.jpg',
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

    const walter = await prisma.admin.findUnique({ where: { username: 'WalterBlack' } });
    const walterPassword = await bcrypt.hash('password123', 10);

    if (!walter) {
        // Double check if lowercase version exists to avoid duplicates
        const existingLower = await prisma.admin.findUnique({ where: { username: 'walterblack' } });
        if (existingLower) {
            await prisma.admin.update({
                where: { id: existingLower.id },
                data: { username: 'WalterBlack', role: 'owner' }
            });
            console.log('Updated existing walterblack to WalterBlack (Owner)');
        } else {
            await prisma.admin.create({
                data: {
                    username: 'WalterBlack',
                    password: walterPassword,
                    name: 'Walter Black',
                    role: 'owner'
                }
            });
            console.log('Created Owner: WalterBlack (password: password123)');
        }
    } else {
        await prisma.admin.update({
            where: { id: walter.id },
            data: { role: 'owner' }
        });
        console.log('Updated WalterBlack to Owner role.');
    }

    const admin = await prisma.admin.findUnique({ where: { username: 'admin' } });
    const adminPassword = await bcrypt.hash('password123', 10);

    if (!admin) {
        await prisma.admin.create({
            data: {
                username: 'admin',
                password: adminPassword,
                name: 'Standard Admin',
                role: 'admin'
            }
        });
        console.log('Created default admin: admin (password: password123)');
    }

    const products = [
        { name: 'Amoxicillin 500mg', price: 45000, description: 'Antibiotic for dental infections' },
        { name: 'Paracetamol 500mg', price: 15000, description: 'Pain relief' },
        { name: 'Dental Care Kit (Pro)', price: 125000, description: 'Toothbrush, floss, and specialized paste' },
        { name: 'Mouthwash (Clinical)', price: 65000, description: 'Antiseptic mouthwash' },
        { name: 'Teeth Whitening Gel', price: 350000, description: 'Home whitening kit supplement' }
    ];

    for (const p of products) {
        const existing = await prisma.product.findFirst({ where: { name: p.name } });
        if (!existing) {
            await prisma.product.create({ data: p });
            console.log(`Created product: ${p.name}`);
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
