import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPatientSession } from "@/actions/patientAuth";

export async function POST(req: NextRequest) {
  try {
    const {
      patientType,
      bookingFor,
      patientInfo,
      dentistName,
      date,
      time,
      treatment,
      notes,
    } = await req.json();

    const doctor = await prisma.doctor.findFirst({
      where: { name: dentistName },
      select: { id: true, name: true }
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    const typedName = `${patientInfo.firstName} ${patientInfo.lastName}`.trim();

    // Check if the user is logged in
    const session = await verifyPatientSession();

    let patient;

    if (session && session.id && bookingFor === "Myself") {
      // Logged-in patient booking for themselves: update their existing record
      patient = await prisma.patient.update({
        where: { id: session.id },
        data: {
          name: typedName,
          phone: patientInfo.phone || undefined,
          birthDate: patientInfo.birthDate ? new Date(patientInfo.birthDate) : undefined,
          address: patientInfo.zipCode || undefined,
          medicalHistory: notes || undefined,
          bookingFor: bookingFor || "Myself",
          patientType: patientType || "returning",
        },
      });
    } else {
      // Guest or booking for someone else: create a new patient record
      patient = await prisma.patient.create({
        data: {
          name: typedName,
          email: patientInfo.email || null,
          phone: patientInfo.phone || null,
          birthDate: patientInfo.birthDate ? new Date(patientInfo.birthDate) : null,
          address: patientInfo.zipCode || null,
          medicalHistory: notes || null,
          bookingFor: bookingFor || "Myself",
          patientType: patientType || "new",
          guardianName: patientInfo.guardian ? `${patientInfo.guardian.firstName} ${patientInfo.guardian.lastName}` : null,
        },
      });
    }

    const slotTaken = await prisma.appointment.findFirst({
      where: {
        doctorID: doctor.id,
        date: new Date(date),
        time,
        status: { not: "cancelled" },
      },
    });

    if (slotTaken) {
      return NextResponse.json(
        { success: false, error: "Slot ini sudah dibooking oleh pasien lain. Silakan pilih waktu yang lain." },
        { status: 409 }
      );
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        treatment,
        patientId: patient.id,
        doctorID: doctor.id,
        notes,
      },
    });

    const queueDate = new Date(date);
    queueDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(queueDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const queueCount = await prisma.queue.count({
      where: {
        date: {
          gte: queueDate,
          lt: nextDay
        }
      }
    });

    await prisma.queue.create({
      data: {
        number: queueCount + 1,
        status: 'waiting',
        patientId: patient.id,
        doctorId: doctor.id,
        date: new Date(date),
        name: patient.name,
        phone: patient.phone,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}
