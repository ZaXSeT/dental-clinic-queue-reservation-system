// app/api/auth/send-otp/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) return NextResponse.json({ message: "Email required" }, { status: 400 });

    // 🔹 Generate OTP (for dev, we use fixed 111111)
    const otp = "111111";

    // TODO: store OTP in DB or in-memory store for verification
    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
