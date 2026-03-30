import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

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
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    let patient = null;

    if (patientInfo.email && patientInfo.email.trim() !== "") {
        patient = await prisma.patient.findFirst({
            where: { email: patientInfo.email },
        });
    }

    const typedName = `${patientInfo.firstName} ${patientInfo.lastName}`.trim();

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: typedName,
          email: patientInfo.email || null,
          phone: patientInfo.phone,
          birthDate: patientInfo.birthDate ? new Date(patientInfo.birthDate) : null,
          address: patientInfo.zipCode || null,
          medicalHistory: patientInfo.comments || null,
        },
      });
    } else if (typedName !== "" && typedName !== patient.name) {
      patient = await prisma.patient.update({
          where: { id: patient.id },
          data: { name: typedName, phone: patientInfo.phone || patient.phone }
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        treatment,
        patientId: patient.id,
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
