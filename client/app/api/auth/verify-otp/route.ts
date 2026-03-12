import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP required" }, { status: 400 });
    }

    
    const cleanOtp = otp.replace(/\s+/g, ""); // removes spaces, tabs, etc.

    // Get latest OTP for this email
    const record = await prisma.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ success: false, message: "OTP not found" }, { status: 400 });
    }

    if (record.code !== cleanOtp) {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json({ success: false, message: "OTP expired" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
