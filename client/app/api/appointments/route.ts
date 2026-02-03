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

    // 1️⃣ Find doctor by name
    const doctor = await prisma.doctor.findFirst({
      where: { name: dentistName },
    });

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: "Doctor not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Create or connect patient
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

    // 3️⃣ Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: new Date(date),
        time,
        treatment,
        patientId: patient.id,
        doctorID: doctor.id, // Connect the doctor
        notes,
      },
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to book appointment" }, { status: 500 });
  }
}
