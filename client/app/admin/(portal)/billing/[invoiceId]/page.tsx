'use client';

import { useState, useEffect } from "react";
import { getInvoiceDetails, markInvoiceAsPaid, deleteInvoiceItem } from "@/actions/billing";
import { Receipt, Calendar, User, Stethoscope, Printer, CheckCircle, ArrowLeft, Package, DollarSign, MapPin, Building2, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InvoiceDetailsPage({ params }: { params: { invoiceId: string } }) {
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getInvoiceDetails(params.invoiceId);
            setInvoice(data);
            setLoading(false);
        };
        fetchDetails();
    }, [params.invoiceId]);

    const handleMarkAsPaid = async () => {
        if (!confirm("Mark this invoice as PAID?")) return;
        setIsUpdating(true);
        const res = await markInvoiceAsPaid(params.invoiceId);
        if (res.success) {
            router.refresh();
            // Refetch data
            const data = await getInvoiceDetails(params.invoiceId);
            setInvoice(data);
        }
        setIsUpdating(false);
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!confirm("Remove this item from the invoice?")) return;
        setIsUpdating(true);
        const res = await deleteInvoiceItem(itemId, params.invoiceId);
        if (res.success) {
            router.refresh();
            const data = await getInvoiceDetails(params.invoiceId);
            setInvoice(data);
        } else {
            alert("Failed to delete item");
        }
        setIsUpdating(false);
    };

    if (loading) return <div className="p-8 text-slate-500 font-medium text-center italic">Retrieving official clinical invoice...</div>;
    if (!invoice) return <div className="p-8 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 text-center">Invoice record not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <Link href="/admin/billing" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-all group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Billing
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Printer className="w-4 h-4" /> Print PDF
                    </button>
                    {invoice.status === 'unpaid' && (
                        <button
                            onClick={handleMarkAsPaid}
                            disabled={isUpdating}
                            className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95 disabled:opacity-50"
                        >
                            <CheckCircle className="w-4 h-4" /> Collect Payment
                        </button>
                    )}
                </div>
            </div>

            {/* Invoice Document Design (Inspired by Siloam Kuitansi) */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">
                {/* Header branding */}
                <div className="p-12 border-b border-slate-100 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Stethoscope className="w-10 h-10" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Go Dental Clinic</h2>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Certified Dental Health Services</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">KWITANSI</h1>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Official Payment Receipt</p>
                    </div>
                </div>

                {/* Metadata Grid */}
                <div className="px-12 py-8 bg-slate-50/50 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Invoice No.</p>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{invoice.invoiceNumber}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date / Time</p>
                        <p className="font-black text-slate-900 text-sm">{format(new Date(invoice.createdAt), "dd MMM yyyy, HH:mm")}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Patient Name</p>
                        <p className="font-black text-slate-900 text-sm">{invoice.patient.name}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Doctor In Charge</p>
                        <p className="font-black text-slate-900 text-sm">Dr. {invoice.appointment?.doctor?.name || 'TBD'}</p>
                    </div>
                </div>

                {/* Line Items Table */}
                <div className="p-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-900/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="text-left pb-4 font-black">Description & Details</th>
                                <th className="px-4 pb-4 text-center font-black">Quantity</th>
                                <th className="text-right pb-4 font-black">Subtotal (Rp)</th>
                                {invoice.status === 'unpaid' && <th className="w-10 pb-4"></th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {invoice.items.map((item: any, idx: number) => (
                                <tr key={idx} className="group">
                                    <td className="py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                {item.type === 'service' ? <Stethoscope className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-sm">{item.description}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{item.type === 'service' ? 'Treatment / Consultation' : 'Pharmacy / Medication'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-6 text-center font-black text-slate-600 text-sm">
                                        {item.quantity}
                                    </td>
                                    <td className="py-6 text-right font-black text-slate-900 text-sm">
                                        {(item.price * item.quantity).toLocaleString('id-ID')}
                                    </td>
                                    {invoice.status === 'unpaid' && (
                                        <td className="py-6 text-right">
                                            <button
                                                onClick={() => handleDeleteItem(item.id)}
                                                disabled={isUpdating}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all print:hidden"
                                            >
                                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals Section */}
                    <div className="mt-12 pt-8 border-t-2 border-slate-900/5 flex flex-col items-end space-y-3">
                        <div className="w-full md:w-64 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Subtotal Amount</span>
                            <span className="text-slate-600">Rp {invoice.totalAmount.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="w-full md:w-64 flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                            <span>Rounding</span>
                            <span className="text-slate-600">Rp 0</span>
                        </div>
                        <div className="w-full md:w-72 bg-slate-900 text-white rounded-2xl p-6 mt-4 shadow-xl flex justify-between items-center group overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1">Total Net Payable</p>
                                <p className="text-2xl font-black tracking-tight">Rp {invoice.totalAmount.toLocaleString('id-ID')}</p>
                            </div>
                            <div className="relative z-10 flex flex-col items-end">
                                <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-1">Status</p>
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black border uppercase tracking-tighter ${invoice.status === 'paid' ? 'bg-green-400/20 text-green-400 border-green-400/30' : 'bg-orange-400/20 text-orange-400 border-orange-400/30'}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="px-12 py-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-[10px]">
                    <div>
                        <p className="font-black text-slate-400 uppercase tracking-widest mb-3">Notice / Perhatian</p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-500 font-bold leading-relaxed">
                            <li>Receipt ini merupakan tanda terima pembayaran resmi.</li>
                            <li>Obat yang sudah dibeli tidak dapat ditukar/dikembalikan.</li>
                            <li>Simpan kuitansi ini untuk klaim asuransi jika diperlukan.</li>
                        </ol>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <div className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center relative group">
                            <div className="absolute inset-2 border border-slate-100 rounded-xl bg-white/50 animate-pulse"></div>
                            <Receipt className="w-12 h-12 text-slate-200 group-hover:text-primary transition-colors" />
                            <p className="absolute bottom-2 text-slate-300 font-black uppercase text-[8px]">Clinic Stamp</p>
                        </div>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <p className="font-black text-slate-400 uppercase tracking-widest mb-12">Authorized Cashier</p>
                        <div className="w-32 h-px bg-slate-300 mb-2"></div>
                        <p className="font-black text-slate-900 uppercase">Septiani</p>
                    </div>
                </div>
            </div>

            {/* NPWP alignment at very bottom */}
            <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N.P.W.P Clinic: 01.234.567.8-901.000 • Issued by Go Dental Financial Dept.</p>
            </div>
        </div>
    );
}
