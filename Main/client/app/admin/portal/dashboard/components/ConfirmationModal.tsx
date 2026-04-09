"use client";

import { AlertTriangle, CheckCircle, Info } from "lucide-react";
import { createPortal } from "react-dom";

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'danger' | 'success';
    loading: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export default function ConfirmationModal({
    isOpen,
    title,
    message,
    type,
    loading,
    onClose,
    onConfirm
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 border border-slate-100">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${type === 'danger' ? 'bg-red-50 text-red-500' :
                    type === 'success' ? 'bg-green-50 text-green-500' :
                        'bg-blue-50 text-blue-500'
                    }`}>
                    {type === 'danger' ? <AlertTriangle className="w-6 h-6" /> :
                        type === 'success' ? <CheckCircle className="w-6 h-6" /> :
                            <Info className="w-6 h-6" />}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 ${type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' :
                            type === 'success' ? 'bg-green-500 hover:bg-green-600 shadow-green-500/20' :
                                'bg-primary hover:bg-sky-600 shadow-primary/20'
                            }`}
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Confirm"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
