import { prisma } from "@/lib/prisma"; // your prisma client
import { NextResponse } from "next/server";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: { patient: true, doctor: true, room: true },
    orderBy: { startTime: "asc" },
  });
  return NextResponse.json(bookings);
}

export async function POST(req: Request) {
  const { patientId, doctorId, roomId, startTime, endTime } = await req.json();

  try {
    const booking = await prisma.booking.create({
      data: {
        patientId,
        doctorId,
        roomId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      },
    });
    return NextResponse.json(booking);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}