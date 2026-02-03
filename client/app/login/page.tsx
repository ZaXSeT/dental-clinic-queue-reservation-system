"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/booking";

  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Dev: prevent resending OTP too fast
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP
  const sendOtp = async () => {
    if (!email) return alert("Email required");
    setLoading(true);
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setOtpSent(true);
      console.log("Dev OTP sent to terminal"); // OTP is logged server-side
    } else {
      alert(data.message);
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async () => {
    if (!otp) return alert("OTP required");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();

    if (data.success) {
      sessionStorage.setItem("user_auth", "true");
      router.push(`${redirect}?step=2`); // redirect to booking Step 2
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
      {!otpSent ? (
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Returning Patient Login</h1>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <button
            onClick={sendOtp}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h1 className="text-xl font-bold mb-4">Enter OTP</h1>
          <input
            type="text"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-4 border rounded-lg"
          />
          <button
            onClick={verifyOtp}
            className="w-full bg-slate-900 text-white py-3 rounded-lg hover:bg-slate-800 transition-colors mb-2"
          >
            Verify OTP
          </button>
          <button
            onClick={() => setOtpSent(false)}
            className="w-full border border-slate-400 py-3 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
