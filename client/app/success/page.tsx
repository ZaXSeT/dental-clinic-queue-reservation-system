'use client';

import { useState, useEffect } from "react";
import { CheckCircle2, FileText, Calendar, MapPin, Clock, User, Loader2, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getInvoiceDetails } from "@/actions/billing";

export default function SuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get('invoiceId');
    const appointmentId = searchParams.get('appointmentId'); // Optional for simple confirmation

    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            if (invoiceId) {
                const data = await getInvoiceDetails(invoiceId);
                if (data) {
                    setInvoice(data);
                }
            }
            setLoading(false);
        };
        fetchInvoice();
    }, [invoiceId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading && invoiceId) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 italic text-slate-400 font-bold">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            Loading your record...
        </div>
    );

    // If no invoiceId, assume it's a simple booking confirmation
    const isConfirmationOnly = !invoiceId;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 print:bg-white print:p-0">
            <div className="max-w-2xl w-full print:max-w-none">
                {/* Header Success */}
                <div className="text-center mb-10 print:hidden">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] shadow-lg shadow-green-100 mb-6 font-bold">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        {isConfirmationOnly ? "Appointment Secured!" : "Treatment Complete!"}
                    </h1>
                    <p className="text-slate-500 mt-3 font-medium">
                        {isConfirmationOnly
                            ? "Your visit at Go Dental Clinic has been scheduled. Registration details have been sent to your email."
                            : "Your treatment is complete. You can now process the payment."
                        }
                    </p>
                </div>

                {/* Patient Summary Card */}
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200 overflow-hidden border border-slate-100 flex flex-col items-stretch print:shadow-none print:border-none print:rounded-none">
                    <div className="p-8 border-b-2 border-dashed border-slate-100 bg-slate-50/50 relative print:bg-white">
                        {/* Decorative side notches - Hidden on print */}
                        <div className="absolute top-full left-0 w-6 h-6 bg-slate-50 rounded-full -translate-x-1/2 -translate-y-1/2 border border-slate-100 print:hidden"></div>
                        <div className="absolute top-full right-0 w-6 h-6 bg-slate-50 rounded-full translate-x-1/2 -translate-y-1/2 border border-slate-100 print:hidden"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black tracking-widest uppercase rounded-lg">
                                    {isConfirmationOnly ? "Booking Confirmation" : "Official Kuitansi"}
                                </span>
                                <h3 className="text-xl font-black text-slate-800 mt-2">
                                    {invoice?.items[0]?.description || "General Dental Visit"}
                                </h3>
                                {invoice?.patient?.name && (
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Patient: {invoice.patient.name}</p>
                                )}
                            </div>
                            {invoice?.billingCode && (
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing Code</p>
                                    <p className="text-lg font-mono font-black text-slate-900 leading-none">{invoice.billingCode}</p>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm print:border-slate-200">
                                <Calendar className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Status</p>
                                    <p className="text-xs font-black text-slate-700">{invoice?.appointment?.status || "Scheduled"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm print:border-slate-200">
                                <Clock className="w-5 h-5 text-slate-400" />
                                <div>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">Check-In</p>
                                    <p className="text-xs font-black text-slate-700">15 mins before</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 space-y-8">
                        {isConfirmationOnly ? (
                            /* Simple Instructions for Booking */
                            <div className="space-y-6">
                                <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                                    <h4 className="text-sm font-black text-blue-900 mb-4 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" /> Next Steps
                                    </h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-3 text-xs font-bold text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-white border border-blue-200 flex items-center justify-center text-[10px] shrink-0 text-blue-600">1</div>
                                            Datang tepat waktu sesuai jadwal yang dipilih.
                                        </li>
                                        <li className="flex items-start gap-3 text-xs font-bold text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-white border border-blue-200 flex items-center justify-center text-[10px] shrink-0 text-blue-600">2</div>
                                            Tunjukkan kode booking atau nama Anda di meja resepsionis.
                                        </li>
                                        <li className="flex items-start gap-3 text-xs font-bold text-slate-600">
                                            <div className="w-5 h-5 rounded-full bg-white border border-blue-200 flex items-center justify-center text-[10px] shrink-0 text-blue-600">3</div>
                                            Pembayaran dilakukan setelah pemeriksaan selesai.
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => router.push("/")}
                                    className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-300 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    Finish & Home
                                </button>
                            </div>
                        ) : (
                            /* Billing Details for Post-Service */
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    {invoice?.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between items-center text-sm font-bold text-slate-500">
                                            <span>{item.description} (x{item.quantity})</span>
                                            <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                                        </div>
                                    ))}
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount Payable</span>
                                            <span className="text-3xl font-black text-slate-900 tracking-tighter">Rp {invoice.totalAmount.toLocaleString('id-ID')}</span>
                                        </div>
                                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest
                                            ${invoice.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}
                                        `}>
                                            {invoice.status === 'paid' ? 'Paid' : 'Awaiting Payment'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 print:hidden">
                                    <button
                                        onClick={() => router.push("/")}
                                        className="w-full h-16 bg-green-600 hover:bg-green-700 text-white rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-green-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        Back Home
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="w-full flex items-center justify-center gap-2 text-primary font-black text-xs uppercase tracking-widest hover:underline"
                                    >
                                        <FileText className="w-4 h-4" /> Download Official Invoice (PDF)
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Secondary Actions - Hidden on print */}
                <div className="mt-8 flex justify-center gap-8 print:hidden">
                    <button className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-colors">
                        Contact Support
                    </button>
                </div>

                {/* Print only footer */}
                <div className="hidden print:block text-center mt-12 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    N.P.W.P Clinic: 01.234.567.8-901.000 • Document Issued by Go Dental Financial Dept.
                </div>
            </div>
        </div>
    );
}
