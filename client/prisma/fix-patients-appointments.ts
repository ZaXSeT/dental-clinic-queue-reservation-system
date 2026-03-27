import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

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
    console.log('Fixing patients and appointments...');

    // ─── 1. Get doctor IDs ────────────────────────────────────────────────
    const allDoctors = await prisma.doctor.findMany({ select: { id: true, name: true } });
    const doctorMap: Record<string, string> = {};
    for (const d of allDoctors) doctorMap[d.name] = d.id;

    const buyginId = doctorMap['Dr. Alexander Buygin'];
    const adlerId  = doctorMap['Dr. Dan Adler'];
    const khaniId  = doctorMap['Dr. F. Khani'];

    if (!buyginId || !adlerId || !khaniId) {
        console.error('One or more doctors not found! Run fix-schedules first.');
        process.exit(1);
    }

    // ─── 2. Seed Patients ─────────────────────────────────────────────────
    const hashedPass = await bcrypt.hash('password123', 10);

    const patientsData = [
        {
            name: 'Ahmad Fauzi',
            username: 'ahmadfauzi',
            password: hashedPass,
            phone: '081234567890',
            email: 'ahmad.fauzi@email.com',
            birthDate: new Date('1990-05-15'),
            address: 'Jl. Merdeka No. 10, Jakarta',
            medicalHistory: 'Riwayat gigi berlubang, pernah cabut gigi bungsu'
        },
        {
            name: 'Siti Rahayu',
            username: 'sitirahayu',
            password: hashedPass,
            phone: '082345678901',
            email: 'siti.rahayu@email.com',
            birthDate: new Date('1995-08-22'),
            address: 'Jl. Sudirman No. 5, Bandung',
            medicalHistory: 'Alergi penisilin, gigi sensitif'
        },
        {
            name: 'Budi Santoso',
            username: 'budisantoso',
            password: hashedPass,
            phone: '083456789012',
            email: 'budi.santoso@email.com',
            birthDate: new Date('1988-03-10'),
            address: 'Jl. Diponegoro No. 20, Surabaya',
            medicalHistory: 'Diabetes terkontrol, perlu perhatian ekstra saat perawatan'
        },
        {
            name: 'Dewi Lestari',
            username: 'dewilestari',
            password: hashedPass,
            phone: '084567890123',
            email: 'dewi.lestari@email.com',
            birthDate: new Date('1998-11-30'),
            address: 'Jl. Gatot Subroto No. 15, Yogyakarta',
            medicalHistory: 'Tidak ada riwayat penyakit khusus'
        },
        {
            name: 'Riko Pratama',
            username: 'rikopratama',
            password: hashedPass,
            phone: '085678901234',
            email: 'riko.pratama@email.com',
            birthDate: new Date('1993-07-04'),
            address: 'Jl. Ahmad Yani No. 8, Medan',
            medicalHistory: 'Bruxism (mengertakkan gigi), sudah pakai night guard'
        },
        {
            name: 'Rina Wulandari',
            username: 'rinawulandari',
            password: hashedPass,
            phone: '086789012345',
            email: 'rina.wulandari@email.com',
            birthDate: new Date('2000-02-18'),
            address: 'Jl. Imam Bonjol No. 3, Semarang',
            medicalHistory: 'Gigi bungsu belum tumbuh sempurna'
        },
        {
            name: 'Hendra Gunawan',
            username: 'hendragunawan',
            password: hashedPass,
            phone: '087890123456',
            email: 'hendra.gunawan@email.com',
            birthDate: new Date('1985-12-25'),
            address: 'Jl. Veteran No. 12, Makassar',
            medicalHistory: 'Perokok aktif, perlu scaling rutin'
        },
        {
            name: 'Nur Hidayah',
            username: 'nurhidayah',
            password: hashedPass,
            phone: '088901234567',
            email: 'nur.hidayah@email.com',
            birthDate: new Date('1997-09-09'),
            address: 'Jl. Pahlawan No. 7, Palembang',
            medicalHistory: 'Sedang hamil trimester 2, perlu konsultasi khusus'
        },
    ];

    const patientIds: Record<string, string> = {};

    for (const p of patientsData) {
        const existing = await prisma.patient.findUnique({ where: { username: p.username } });
        if (!existing) {
            const created = await prisma.patient.create({ data: p });
            patientIds[p.username] = created.id;
            console.log(`Created patient: ${p.name}`);
        } else {
            patientIds[p.username] = existing.id;
            console.log(`Skipped existing patient: ${p.name}`);
        }
    }

    // ─── 3. Seed Appointments ─────────────────────────────────────────────
    const today = new Date();
    const d = (offset: number) => {
        const date = new Date(today);
        date.setDate(today.getDate() + offset);
        date.setHours(0, 0, 0, 0);
        return date;
    };

    const appointmentsData = [
        // Past (completed)
        {
            patientUsername: 'ahmadfauzi',
            doctorId: buyginId,
            date: d(-14),
            time: '09:00 AM',
            status: 'completed',
            treatment: 'Teeth Scaling',
            notes: 'Karang gigi cukup tebal, disarankan scaling 6 bulan sekali'
        },
        {
            patientUsername: 'sitirahayu',
            doctorId: adlerId,
            date: d(-10),
            time: '10:00 AM',
            status: 'completed',
            treatment: 'Dental Filling',
            notes: 'Tambalan gigi geraham kanan bawah, composite resin'
        },
        {
            patientUsername: 'budisantoso',
            doctorId: khaniId,
            date: d(-7),
            time: '02:00 PM',
            status: 'completed',
            treatment: 'General Checkup',
            notes: 'Pemeriksaan rutin, kondisi gigi baik'
        },
        {
            patientUsername: 'dewilestari',
            doctorId: buyginId,
            date: d(-5),
            time: '11:00 AM',
            status: 'completed',
            treatment: 'Teeth Whitening',
            notes: 'Bleaching 1 sesi, hasil memuaskan'
        },
        {
            patientUsername: 'rikopratama',
            doctorId: adlerId,
            date: d(-3),
            time: '12:00 PM',
            status: 'completed',
            treatment: 'Root Canal',
            notes: 'Perawatan saluran akar gigi 36, selesai 1 sesi'
        },
        // Today & upcoming (scheduled)
        {
            patientUsername: 'rinawulandari',
            doctorId: khaniId,
            date: d(0),
            time: '10:00 AM',
            status: 'scheduled',
            treatment: 'Tooth Extraction',
            notes: 'Pencabutan gigi bungsu kiri bawah'
        },
        {
            patientUsername: 'hendra gunawan',
            doctorId: buyginId,
            date: d(0),
            time: '02:00 PM',
            status: 'scheduled',
            treatment: 'Teeth Scaling',
            notes: 'Scaling rutin 6 bulanan'
        },
        {
            patientUsername: 'ahmadfauzi',
            doctorId: adlerId,
            date: d(2),
            time: '09:00 AM',
            status: 'scheduled',
            treatment: 'Dental Veneer',
            notes: 'Konsultasi veneer gigi depan'
        },
        {
            patientUsername: 'nurhidayah',
            doctorId: khaniId,
            date: d(3),
            time: '10:00 AM',
            status: 'scheduled',
            treatment: 'General Checkup',
            notes: 'Pemeriksaan gigi selama kehamilan'
        },
        {
            patientUsername: 'sitirahayu',
            doctorId: buyginId,
            date: d(5),
            time: '11:40 AM',
            status: 'scheduled',
            treatment: 'Orthodontic Consultation',
            notes: 'Konsultasi kawat gigi'
        },
        {
            patientUsername: 'budisantoso',
            doctorId: adlerId,
            date: d(7),
            time: '12:00 PM',
            status: 'scheduled',
            treatment: 'Dental Implant',
            notes: 'Konsultasi implan gigi molar'
        },
        {
            patientUsername: 'dewilestari',
            doctorId: khaniId,
            date: d(10),
            time: '01:00 PM',
            status: 'scheduled',
            treatment: 'Teeth Whitening',
            notes: 'Sesi bleaching lanjutan'
        },
        // Cancelled
        {
            patientUsername: 'rikopratama',
            doctorId: buyginId,
            date: d(-1),
            time: '09:00 AM',
            status: 'cancelled',
            treatment: 'Dental Filling',
            notes: 'Pasien membatalkan karena berhalangan'
        },
    ];

    let created = 0;
    let skipped = 0;

    for (const a of appointmentsData) {
        const username = a.patientUsername.replace(' ', '');
        const pid = patientIds[username];
        if (!pid) {
            console.warn(`  ⚠ Patient not found for username: ${username}, skipping appointment`);
            skipped++;
            continue;
        }

        // Check if appointment already exists (same patient + date + time)
        const existing = await prisma.appointment.findFirst({
            where: {
                patientId: pid,
                date: a.date,
                time: a.time,
            }
        });

        if (!existing) {
            await prisma.appointment.create({
                data: {
                    patientId: pid,
                    doctorID: a.doctorId,
                    date: a.date,
                    time: a.time,
                    status: a.status,
                    treatment: a.treatment,
                    notes: a.notes,
                }
            });
            created++;
        } else {
            skipped++;
        }
    }

    console.log(`\nAppointments: ${created} created, ${skipped} skipped`);
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
