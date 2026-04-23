'use client';

import { useState, useEffect } from "react";
import { getInvoiceDetails, markInvoiceAsPaid, deleteInvoiceItem } from "@/actions/billing";
import { Receipt, Calendar, User, Stethoscope, Printer, CheckCircle, ArrowLeft, Package, DollarSign, MapPin, Building2, Trash2, Loader2, AlertTriangle, X, ShieldCheck } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ─── Custom Confirm Modal ─────────────────────────────────────────────────────
interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    confirmStyle?: "green" | "red";
    icon?: React.ReactNode;
}

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmLabel = "Confirm", confirmStyle = "green", icon }: ConfirmModalProps) {
    if (!isOpen) return null;
    const confirmClass = confirmStyle === "red"
        ? "bg-red-500 hover:bg-red-600 shadow-red-500/20"
        : "bg-green-500 hover:bg-green-600 shadow-green-500/20";

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Top accent bar */}
                <div className={`h-1.5 w-full ${confirmStyle === "red" ? "bg-gradient-to-r from-red-400 to-rose-500" : "bg-gradient-to-r from-green-400 to-emerald-500"}`} />

                <div className="p-8">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 ${confirmStyle === "red" ? "bg-red-50 text-red-500" : "bg-green-50 text-green-500"}`}>
                        {icon || <AlertTriangle className="w-7 h-7" />}
                    </div>

                    {/* Text */}
                    <div className="text-center mb-7">
                        <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl border border-slate-200 bg-white text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`flex-[1.5] py-3 rounded-2xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 ${confirmClass}`}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoiceDetailsPage({ params }: { params: { invoiceId: string } }) {
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    // Modal state
    const [payModal, setPayModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; itemId: string }>({ open: false, itemId: "" });

    useEffect(() => {
        const fetchDetails = async () => {
            const data = await getInvoiceDetails(params.invoiceId);
            setInvoice(data);
            setLoading(false);
        };
        fetchDetails();
    }, [params.invoiceId]);

    const handleMarkAsPaid = async () => {
        setIsUpdating(true);
        const res = await markInvoiceAsPaid(params.invoiceId);
        if (res.success) {
            router.refresh();
            const data = await getInvoiceDetails(params.invoiceId);
            setInvoice(data);
        }
        setIsUpdating(false);
    };

    const handleDeleteItem = async () => {
        if (!deleteModal.itemId) return;
        setIsUpdating(true);
        const res = await deleteInvoiceItem(deleteModal.itemId, params.invoiceId);
        if (res.success) {
            router.refresh();
            const data = await getInvoiceDetails(params.invoiceId);
            setInvoice(data);
        }
        setIsUpdating(false);
    };

    if (loading) return <div className="p-8 text-slate-500 font-medium text-center italic">Retrieving official clinical invoice...</div>;
    if (!invoice) return <div className="p-8 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 text-center">Invoice record not found.</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-20">

            {/* ── Confirm Pay Modal ── */}
            <ConfirmModal
                isOpen={payModal}
                onClose={() => setPayModal(false)}
                onConfirm={handleMarkAsPaid}
                title="Collect Payment"
                message={`Mark invoice ${invoice.invoiceNumber} as PAID? This action cannot be undone.`}
                confirmLabel="Yes, Mark as Paid"
                confirmStyle="green"
                icon={<ShieldCheck className="w-7 h-7" />}
            />

            {/* ── Confirm Delete Item Modal ── */}
            <ConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, itemId: "" })}
                onConfirm={handleDeleteItem}
                title="Remove Item"
                message="Are you sure you want to remove this item from the invoice? This cannot be undone."
                confirmLabel="Remove Item"
                confirmStyle="red"
                icon={<Trash2 className="w-7 h-7" />}
            />

            {/* Header */}
            <div className="flex items-center justify-between">
                <Link href="/staff/portal/billing" className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-all group">
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
                            onClick={() => setPayModal(true)}
                            disabled={isUpdating}
                            className="px-6 py-2.5 bg-green-500 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                            Collect Payment
                        </button>
                    )}
                </div>
            </div>

            {/* Invoice Card */}
            <div id="invoice-print" className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden print:shadow-none print:border-none">

                {/* Clinic Header */}
                <div className="p-12 border-b border-slate-100 flex justify-between items-start">
                    <div className="flex items-center gap-4">
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

                {/* Meta Grid */}
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

                {/* Items Table */}
                <div className="p-12">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-900/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <th className="text-left pb-4 font-black">Description &amp; Details</th>
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
                                    <td className="px-4 py-6 text-center font-black text-slate-600 text-sm">{item.quantity}</td>
                                    <td className="py-6 text-right font-black text-slate-900 text-sm">{(item.price * item.quantity).toLocaleString('id-ID')}</td>
                                    {invoice.status === 'unpaid' && (
                                        <td className="py-6 text-right">
                                            <button
                                                onClick={() => setDeleteModal({ open: true, itemId: item.id })}
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

                    {/* Totals */}
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

                {/* Footer */}
                <div className="px-12 py-10 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8 text-[10px]">
                    <div>
                        <p className="font-black text-slate-400 uppercase tracking-widest mb-3">Notice / Perhatian</p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-500 font-bold leading-relaxed">
                            <li>Receipt ini merupakan tanda terima pembayaran resmi.</li>
                            <li>Obat yang sudah dibeli tidak dapat ditukar/dikembalikan.</li>
                            <li>Simpan kuitansi ini untuk klaim asuransi jika diperlukan.</li>
                        </ol>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">N.P.W.P Clinic: 01.234.567.8-901.000 • Issued by Go Dental Financial Dept.</p>
            </div>
        </div>
    );
}
