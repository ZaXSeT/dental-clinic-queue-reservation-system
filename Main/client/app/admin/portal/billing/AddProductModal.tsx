'use client';

import { useState } from 'react';
import { addInvoiceItem } from '@/actions/billing';
import { X, Plus, Package, ShoppingCart, Save } from 'lucide-react';

export default function AddProductModal({ invoice, products, onClose }: { invoice: any, products: any[], onClose: () => void }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [qty, setQty] = useState(1);
    const [price, setPrice] = useState(0);

    const onSelectProduct = (p: any) => {
        setSelectedProduct(p);
        setPrice(p.price);
    };

    const handleAdd = async () => {
        if (!selectedProduct) return;
        setIsLoading(true);
        const res = await addInvoiceItem(invoice.dbId, {
            description: selectedProduct.name,
            quantity: qty,
            price: price,
            type: 'product',
            productId: selectedProduct.id
        });
        setIsLoading(false);
        if (res.success) {
            onClose();
            window.location.reload();
        } else {
            alert(res.error);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <Package className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Add Items to Bill</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Invoice</p>
                        <p className="font-bold text-slate-800">{invoice.id} • {invoice.patient}</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Product / Medicine</label>
                        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto p-1">
                            {products.map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => onSelectProduct(p)}
                                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${selectedProduct?.id === p.id ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                                >
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase">Rp {p.price.toLocaleString('id-ID')}</p>
                                    </div>
                                    {selectedProduct?.id === p.id && <div className="w-2 h-2 rounded-full bg-primary"></div>}
                                </button>
                            ))}
                        </div>
                    </div>

                    {selectedProduct && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Unit Price (Rp)</label>
                                <input
                                    type="number"
                                    value={price}
                                    onChange={e => setPrice(parseInt(e.target.value))}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantity</label>
                                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                                    <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50">-</button>
                                    <input
                                        type="number"
                                        value={qty}
                                        readOnly
                                        className="flex-1 bg-transparent text-center font-black text-slate-800 text-lg outline-none"
                                    />
                                    <button onClick={() => setQty(qty + 1)} className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-50">+</button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-xs font-black text-slate-400 uppercase">Subtotal</span>
                                <span className="text-xl font-black text-primary">Rp {(price * qty).toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAdd}
                    disabled={!selectedProduct || isLoading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-slate-200 active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            Add to Invoice
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
