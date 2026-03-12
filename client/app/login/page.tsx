"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowLeft } from "lucide-react";

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
      console.log("Dev OTP sent to terminal");
    } else {
      alert(data.message);
    }
  };


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
      router.push(`${redirect}?step=2`);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 to-blue-50/50 font-sans selection:bg-blue-100">
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
        {!otpSent ? (
          <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => router.push(redirect === "/booking" ? "/booking" : "/")}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors border border-slate-100"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Patient Login</h1>
              </div>
            </div>
            
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Enter your registered email to continue booking your appointment. We'll send you a secure one-time password.
            </p>

            <div className="space-y-5">
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-2xl focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all placeholder:text-slate-400 bg-slate-50/50 focus:bg-white font-medium"
                />
              </div>
              <button
                onClick={sendOtp}
                disabled={loading || !email}
                className="w-full bg-[#009ae2] text-white font-bold py-4 rounded-2xl hover:bg-[#0088cc] hover:shadow-lg hover:shadow-[#009ae2]/30 transition-all disabled:opacity-60 disabled:hover:shadow-none hover:-translate-y-0.5 disabled:hover:translate-y-0"
              >
                {loading ? "Sending Code..." : "Send OTP"}
              </button>
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in-[0.98] fade-in duration-500">
             <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 text-[#009ae2] mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
             </div>

            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Check your email</h1>
              <p className="text-slate-500 text-sm leading-relaxed">
                We've sent a 6-digit verification code to <br/><span className="font-bold text-slate-700">{email}</span>
              </p>
            </div>

            <div className="space-y-4">
               <input
                 type="text"
                 placeholder="• • • • • •"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 className="w-full p-4 text-center tracking-[1em] font-black text-2xl border border-slate-200 rounded-2xl focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all bg-slate-50/50 focus:bg-white"
                 maxLength={6}
               />
              <button
                onClick={verifyOtp}
                className="w-full bg-[#009ae2] text-white font-bold py-4 rounded-2xl hover:bg-[#0088cc] hover:shadow-lg hover:shadow-[#009ae2]/30 transition-all hover:-translate-y-0.5"
              >
                Verify & Proceed
              </button>
              <button
                onClick={() => setOtpSent(false)}
                className="w-full font-bold text-slate-500 py-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
              >
                Try a different email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
