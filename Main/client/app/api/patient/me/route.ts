import { NextResponse } from 'next/server';
import { verifyPatientSession } from '@/actions/patientAuth';
import { prisma } from '@/lib/prisma'; // added prisma

export async function GET() {
    const session = await verifyPatientSession();
    if (!session) {
        return NextResponse.json({ loggedIn: false });
    }

    const patient = await prisma.patient.findUnique({
        where: { id: session.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            birthDate: true,
            address: true,
            medicalHistory: true,
            guardianName: true
        }
    });

    if (!patient) {
        return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({ 
        loggedIn: true, 
        ...patient
    });
}
