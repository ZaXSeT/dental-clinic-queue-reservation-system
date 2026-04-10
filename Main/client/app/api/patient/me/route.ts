import { NextResponse } from 'next/server';
import { verifyPatientSession } from '@/actions/patientAuth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    const session = await verifyPatientSession();
    if (!session) {
        return NextResponse.json({ loggedIn: false });
    }

    const patient = await prisma.patient.findUnique({
        where: { id: session.id },
        select: { phone: true }
    });

    return NextResponse.json({ 
        loggedIn: true, 
        name: session.name, 
        email: session.email,
        phone: patient?.phone || ''
    });
}
