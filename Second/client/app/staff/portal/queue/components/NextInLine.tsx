"use client";

import { Trash2 } from "lucide-react";

interface NextInLineProps {
    next: any[];
    waitingCount: number;
    onRemove?: (id: string) => void;
}

export default function NextInLine({ next, waitingCount, onRemove }: NextInLineProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                Next in Line <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs border border-slate-200">{waitingCount} Waiting</span>
            </h3>
            <div className="space-y-3">
                {next.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm">No patients waiting in queue.</div>
                ) : (
                    next.map((p, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-slate-50/50 rounded-xl border border-slate-100 group hover:border-primary/30 hover:bg-white hover:shadow-md transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-auto px-3 min-w-[2.5rem] bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-slate-500 text-sm group-hover:text-primary group-hover:border-primary/20 whitespace-nowrap">
                                    #{p.number}
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-700">{p.name || p.patient?.name || "Guest"}</span>
                                    <span className="text-xs text-slate-400">
                                        {p.patient?.appointments?.[0]?.time ? (
                                            <span className="font-medium text-slate-500 mr-1">{p.patient.appointments[0].time} • </span>
                                        ) : null}
                                        {p.doctor ? `Doc: ${p.doctor.name}` : "General Checkup"}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                {onRemove && (
                                    <button
                                        onClick={() => {
                                            if (confirm(`Remove ${p.name || 'this patient'} from queue? Their appointment slot will be freed up.`)) {
                                                onRemove(p.id);
                                            }
                                        }}
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors" title="Remove & Cancel Slot">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
