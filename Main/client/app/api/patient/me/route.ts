import { NextResponse } from 'next/server';
import { verifyPatientSession } from '@/actions/patientAuth';

export async function GET() {
    const session = await verifyPatientSession();
    if (!session) {
        return NextResponse.json({ loggedIn: false });
    }
    return NextResponse.json({ loggedIn: true, name: session.name, email: session.email });
}
