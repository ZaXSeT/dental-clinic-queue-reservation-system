"use client";

import { RefreshCcw, UserPlus } from "lucide-react";

interface QuickActionsProps {
    onAddWalkIn: () => void;
    onReset: () => void;
}

export default function QuickActions({ onAddWalkIn, onReset }: QuickActionsProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onAddWalkIn}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-blue-50/50 hover:border-blue-200 hover:text-blue-600 transition-all text-left group"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 mb-3 group-hover:border-blue-100 group-hover:bg-blue-50">
                        <UserPlus className="h-5 w-5 text-slate-400 group-hover:text-blue-500" />
                    </div>
                    <div className="font-bold text-sm">Add Walk-in</div>
                    <div className="text-xs text-slate-400 mt-1">Register new guest</div>
                </button>

                <button
                    onClick={onReset}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:bg-red-50/50 hover:border-red-200 hover:text-red-600 transition-all text-left group"
                >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 mb-3 group-hover:border-red-100 group-hover:bg-red-50">
                        <RefreshCcw className="h-5 w-5 text-slate-400 group-hover:text-red-500" />
                    </div>
                    <div className="font-bold text-sm">Reset Today</div>
                    <div className="text-xs text-slate-400 mt-1">Clear all queues</div>
                </button>
            </div>
        </div>
    );
}
