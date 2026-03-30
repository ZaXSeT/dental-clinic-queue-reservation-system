"use client";

import { CheckCircle, Mic, Play, Stethoscope } from "lucide-react";

interface RoomCardProps {
    room: { id: string; name: string; label: string };
    active: any;
    isBusy: boolean;
    loading: boolean;
    waitingCount: number;
    onCallNext: (roomId: string) => void;
    onComplete: (id: string, name: string) => void;
    onRecall: (id: string, name: string) => void;
}

export default function RoomCard({
    room,
    active,
    isBusy,
    loading,
    waitingCount,
    onCallNext,
    onComplete,
    onRecall
}: RoomCardProps) {
    return (
        <div className={`rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col ${isBusy ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50' : 'bg-slate-50 border-slate-200 border-dashed'}`}>
            {isBusy && <div className="absolute top-0 w-full h-1.5 bg-primary"></div>}

            <div className="p-6 flex-1 flex flex-col text-center">
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-xs">{room.label}</span>
                    {isBusy ? (
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Busy</span>
                    ) : (
                        <span className="bg-slate-200 text-slate-500 text-xs font-bold px-2 py-1 rounded">Empty</span>
                    )}
                </div>

                <div className="mb-2">
                    <h3 className="font-bold text-slate-800">{room.name}</h3>
                </div>

                {isBusy ? (
                    <div className="flex-1 flex flex-col justify-center py-4">
                        <div className="text-6xl font-black text-primary mb-2 tracking-tighter">#{active.number}</div>
                        <div className="text-xl font-bold text-slate-900 line-clamp-1">{active.name || active.patient?.name || "Guest"}</div>
                        <div className="text-sm text-slate-400 mt-1">Check-up</div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col justify-center py-8 opacity-50">
                        <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <div className="text-sm font-medium text-slate-500">Ready for patient</div>
                    </div>
                )}

                <div className="mt-6 space-y-3">
                    {isBusy ? (
                        <>
                            <button
                                onClick={() => onComplete(active.id, active.name)}
                                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="h-4 w-4" /> Finish
                            </button>
                            <button
                                onClick={() => onRecall(active.id, active.name)}
                                className="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-2"
                            >
                                <Mic className="h-4 w-4" /> Recall
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onCallNext(room.id)}
                            disabled={waitingCount === 0 || loading}
                            className="w-full py-4 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-primary"
                        >
                            <Play className="h-4 w-4 fill-current" /> Call Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
