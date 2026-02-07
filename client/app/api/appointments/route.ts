import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // make sure prisma client is exported

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

    let patient = await prisma.patient.findFirst({
      where: { email: patientInfo.email },
    });

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          name: `${patientInfo.firstName} ${patientInfo.lastName}`,
          email: patientInfo.email,
          phone: patientInfo.phone,
          birthDate: patientInfo.birthDate ? new Date(patientInfo.birthDate) : null,
          address: patientInfo.zipCode || null,
          medicalHistory: patientInfo.comments || null,
        },
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        treatment,
        patientId: patient.id,
        doctor: {
          connect: { id: doctor.id }
        },
        notes,
      } as any,
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
      } as any,
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to book appointment" }, { status: 500 });
  }
}
