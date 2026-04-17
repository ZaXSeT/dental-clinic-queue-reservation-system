import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'; // Disable Next.js static caching on this route

export async function GET() {
    try {
        const doctors = await prisma.doctor.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                specialization: true,
                image: true,
                availability: true,
                appointments: {
                    where: { status: { not: "cancelled" } },
                    select: { date: true, time: true }
                }
            }
        });
        return NextResponse.json({ success: true, data: doctors }, {
            headers: { 'Cache-Control': 'no-store' }
        });
    } catch (error: any) {
        console.error("Error fetching doctors:", error);
        return NextResponse.json({ success: false, error: String(error), details: error?.message, stack: error?.stack }, { status: 500 });
    }
}
