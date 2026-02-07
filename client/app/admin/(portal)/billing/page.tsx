'use client';

import { useState, useEffect } from "react";
import { getBillingData } from "@/actions/owner";
import { getAllProducts } from "@/actions/billing";
import { Receipt, History, CheckCircle2, FileText, Wallet, TrendingUp, Users, ArrowUpRight, Plus, Printer, ShoppingCart, Package } from "lucide-react";
import AddProductModal from "./AddProductModal";
import ProductManager from "./ProductManager";
import Link from "next/link";

export default function BillingPage() {
    const [billing, setBilling] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    const [showProductManager, setShowProductManager] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            const [billRes, prodRes] = await Promise.all([
                getBillingData(),
                getAllProducts()
            ]);

            if (billRes.success) setBilling(billRes.data);
            setProducts(prodRes || []);
            setLoading(false);
        };
        fetchInitialData();
    }, []);

    if (loading) return <div className="p-8 text-slate-500 font-medium text-center">Loading clinic financial records...</div>;
    if (!billing) return <div className="p-8 text-red-500 font-bold bg-red-50 rounded-2xl border border-red-100 text-center text-sm">Failed to retrieve financial data.</div>;

    return (
        <div className="max-w-6xl space-y-8 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">Financial Overview</h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium italic">Manage clinic revenue, patient invoices, and tax billing codes</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowProductManager(true)}
                        className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Package className="w-4 h-4" /> Manage Catalog
                    </button>
                    <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        Real-time Database Sync
                    </div>
                </div>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-primary/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid Revenue</p>
                        <h2 className="text-3xl font-black text-slate-900">{billing.stats.totalRevenue}</h2>
                    </div>
                </div>

                <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between group hover:border-orange-500/20 transition-all">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Awaiting Collection</p>
                        <h2 className="text-3xl font-black text-slate-900 text-orange-600">{billing.stats.pendingPayments}</h2>
                    </div>
                </div>

                <div className="bg-slate-900 p-7 rounded-[2.5rem] shadow-2xl shadow-slate-300 flex flex-col justify-between relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 bg-white/10 text-white rounded-2xl">
                            <Receipt className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Clinic NPWP</p>
                        <h2 className="text-lg font-black tracking-widest leading-none">{billing.stats.taxID.split(': ')[1]}</h2>
                        <p className="text-[9px] text-slate-500 font-bold mt-2 italic uppercase">Authorized Billing Identity</p>
                    </div>
                </div>
            </div>

            {/* Invoice Management Section */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <History className="h-5 w-5 text-slate-400" />
                        <h3 className="font-black text-xl text-slate-900">Patient Billing Records</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-[0.15em]">
                            <tr>
                                <th className="px-8 py-5">Invoice Number</th>
                                <th className="px-8 py-5">Patient Details</th>
                                <th className="px-8 py-5">Main Procedure</th>
                                <th className="px-8 py-5">Total Bill</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {billing.invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center text-slate-400 font-medium italic">No active invoices found. Submit treatment from Appointments page first.</td>
                                </tr>
                            ) : (
                                billing.invoices.map((inv: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-slate-50/70 transition-all font-medium group">
                                        <td className="px-8 py-6">
                                            <div className="font-black text-slate-900 group-hover:text-primary transition-colors">{inv.id}</div>
                                            <div className="text-[10px] text-slate-400 font-bold font-mono tracking-tighter mt-1 italic">Code: {inv.billingCode}</div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <span className="font-black text-slate-700">{inv.patient}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-slate-500 text-xs font-bold uppercase">{inv.treatment}</td>
                                        <td className="px-8 py-6 text-slate-900 font-black">{inv.amount}</td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-tight
                                                ${inv.status === 'Paid' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-orange-50 text-orange-600 border-orange-100'}
                                            `}>
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedInvoice(inv)}
                                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all shadow-sm flex items-center gap-2 text-[10px] font-black uppercase mb-0"
                                                title="Add Products"
                                            >
                                                <Plus className="w-4 h-4" /> Items
                                            </button>
                                            <Link
                                                href={`/admin/billing/${inv.dbId}`}
                                                className="p-2.5 bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all shadow-sm"
                                                title="View/Print Invoice"
                                            >
                                                <Printer className="w-5 h-5" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {selectedInvoice && (
                <AddProductModal
                    invoice={selectedInvoice}
                    products={products}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}

            {showProductManager && (
                <ProductManager
                    products={products}
                    onClose={() => setShowProductManager(false)}
                />
            )}
        </div>
    );
}
