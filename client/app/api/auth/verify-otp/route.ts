// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) return NextResponse.json({ message: "Email and OTP required" }, { status: 400 });

    // 🔹 For dev, OTP is always 111111
    if (otp !== "111111") {
      return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "OTP verified" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
