'use client';

import { useState } from 'react';
import { createProduct, updateProduct, deleteProduct } from '@/actions/product';
import { Package, Plus, Pencil, Trash2, X, Save, AlertTriangle, Search } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    price: number;
    description: string | null;
    stock: number;
}

interface ProductManagerProps {
    products: Product[];
    onClose: () => void;
}

export default function ProductManager({ products: initialProducts, onClose }: ProductManagerProps) {
    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        stock: ''
    });

    const resetForm = () => {
        setFormData({ name: '', price: '', description: '', stock: '' });
        setIsAdding(false);
        setIsEditing(null);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) return;
        setIsLoading(true);

        const payload = {
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            stock: Number(formData.stock) || 0
        };

        let res;
        if (isEditing) {
            res = await updateProduct(isEditing.id, payload);
        } else {
            res = await createProduct(payload);
        }

        setIsLoading(false);

        if (res.success) {
            // Optimistic update or reload would be better, but for now simple refresh logic
            // In a real app we'd update the local state or invalidate queries
            window.location.reload();
        } else {
            alert("Failed to save product.");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        setIsLoading(true);
        const res = await deleteProduct(id);
        setIsLoading(false);
        if (res.success) {
            setProducts(products.filter(p => p.id !== id));
        } else {
            alert("Failed to delete product.");
        }
    };

    const startEdit = (product: Product) => {
        setIsEditing(product);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            stock: product.stock.toString()
        });
        setIsAdding(false);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-[120] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col border border-slate-100 animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Catalog</h2>
                            <p className="text-sm text-slate-500 font-medium">Manage medicines, treatments, and services</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* List Section */}
                    <div className={`flex-1 flex flex-col border-r border-slate-100 ${(isAdding || isEditing) ? 'hidden md:flex' : 'flex'}`}>
                        {/* Search & Add Bar */}
                        <div className="p-6 border-b border-slate-100 flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl font-bold text-sm text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none placeholder:text-slate-400 placeholder:font-medium transition-all"
                                />
                            </div>
                            <button
                                onClick={() => { setIsAdding(true); setIsEditing(null); setFormData({ name: '', price: '', description: '', stock: '' }); }}
                                className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>

                        {/* Products List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {filteredProducts.length === 0 ? (
                                <div className="text-center py-20 text-slate-400">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p className="font-bold">No products found</p>
                                </div>
                            ) : (
                                filteredProducts.map(product => (
                                    <div key={product.id} className="group p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all flex justify-between items-center">
                                        <div>
                                            <h4 className="font-bold text-slate-900">{product.name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                                                    Rp {product.price.toLocaleString('id-ID')}
                                                </span>
                                                {product.stock > 0 && (
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                                        Stock: {product.stock}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(product)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Form Section */}
                    {(isAdding || isEditing) && (
                        <div className="w-full md:w-[400px] bg-slate-50/50 p-8 flex flex-col overflow-y-auto animate-in slide-in-from-right-10 duration-300">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-slate-900">
                                    {isEditing ? 'Edit Product' : 'New Product'}
                                </h3>
                                <button onClick={resetForm} className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider">
                                    Cancel
                                </button>
                            </div>

                            <div className="space-y-6 flex-1">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                        placeholder="e.g. Paracetamol 500mg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Price (Rp)</label>
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Description (Optional)</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none text-sm"
                                        placeholder="Product details..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Stock (Optional)</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={isLoading || !formData.name || !formData.price}
                                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-indigo-200 mt-8 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" /> Save Product
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
