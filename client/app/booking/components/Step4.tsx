"use client";

import { useState } from "react";
import { ArrowLeft, User, UserPlus, Calendar, MapPin } from "lucide-react";
import { BookingSelection, Doctor, BookingForType, PatientType } from "@/lib/types";
import { useRouter } from "next/navigation";

interface Step4Props {
  bookingData: BookingSelection | null;
  selectedDoc: Doctor | null;
  appointmentType: string | null;
  bookingFor: BookingForType;
  patientType: PatientType;
  onBack: () => void;
  onSetBookingFor: (type: BookingForType) => void;
  onComplete: () => void;
}

export default function Step4({
  bookingData,
  selectedDoc,
  appointmentType,
  bookingFor,
  patientType,
  onBack,
  onSetBookingFor,
  onComplete,
}: Step4Props) {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [legalSex, setLegalSex] = useState<"Male" | "Female">("Male");
  const [birthDate, setBirthDate] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!bookingData || !selectedDoc) return;

    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientType,
          bookingFor,
          patientInfo: {
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            birthDate,
            legalSex,
            zipCode,
            email,
            phone,
            comments,
          },
          dentistName: selectedDoc.name,
          date: bookingData.date,
          time: bookingData.time,
          treatment: appointmentType || "Consultation",
          notes: comments,
        }),
      });

      const data = await res.json();
      console.log("Appointment created:", data);

      if (data.success && data.invoiceId) {
        router.push(`/success?invoiceId=${data.invoiceId}`);
      } else {
        onComplete(); // fallback
      }
    } catch (error) {
      console.error("Failed to book appointment:", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-in slide-in-from-right-8 duration-500 pb-20 pt-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Form */}
        <div className="flex-1 bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 w-full">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-primary flex items-center gap-2 text-sm font-bold mb-8 transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
          </button>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">Who are you booking for?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {["Myself", "Child or dependent", "Someone else"].map((opt) => (
              <button
                key={opt}
                onClick={() => onSetBookingFor(opt as BookingForType)}
                className={`py-4 px-2 rounded-xl border-2 font-bold text-sm transition-all duration-200 flex flex-col items-center justify-center gap-2
                ${bookingFor === opt
                    ? "border-[#009ae2] bg-blue-50/50 text-[#009ae2] shadow-sm"
                    : "border-slate-100 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                <div className="text-2xl">
                  {opt === "Myself" ? <User className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                </div>
                {opt}
              </button>
            ))}
          </div>

          {/* Patient Details */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Patient details</h2>
            <p className="text-slate-500 text-sm mb-6">
              Please provide the following information about the person receiving care.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">First name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Last name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Legal sex</label>
                <select
                  value={legalSex}
                  onChange={(e) => setLegalSex(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium bg-white text-slate-600"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Date of birth</label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Zip/postal code</label>
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact details</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Phone number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium"
                />
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Other details</h2>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Comments or special request</label>
              <textarea
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#009ae2] focus:ring-1 focus:ring-[#009ae2] outline-none transition-all font-medium resize-none"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-[#009ae2] hover:opacity-90 text-white font-bold rounded-full shadow-lg shadow-[#009ae2]/40 transition-all text-lg"
            >
              {loading ? "Booking..." : "Book appointment"}
            </button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="w-full lg:w-[400px] flex-shrink-0">
          <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-6">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Appointment details</h3>
            {selectedDoc && bookingData && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{appointmentType}</div>
                    <div className="text-slate-500 text-sm mt-1">
                      {new Date(bookingData.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      <br />
                      at {bookingData.time}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Go Dental Clinic</div>
                    <div className="text-slate-500 text-sm mt-1 leading-relaxed">
                      Jl. Bantaran Sungai, Hutan, Kec. Percut Sei Tuan, Deli Serdang, Sumatera Utara
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-50">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-slate-100">
                    <img
                      src={selectedDoc.image || "/resources/avatar-placeholder.png"}
                      alt={selectedDoc.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{selectedDoc.name}</div>
                    <div className="text-slate-500 text-xs uppercase tracking-wider font-bold mt-0.5">
                      {selectedDoc.specialization}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
