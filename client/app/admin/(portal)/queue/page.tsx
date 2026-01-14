"use client";

import { Mic, SkipForward, CheckCircle, RefreshCcw, UserPlus } from "lucide-react";
import { useState } from "react";

export default function QueueControlPage() {
    const [activePatient, setActivePatient] = useState({
        id: "A102", name: "John Doe", service: "Scaling", dentist: "Dr. Sarah Wilson"
    });

    const handleAction = (action: string) => {
        // API call to backend would happen here
        console.log("Action:", action);
        alert(`${action} triggered for ${activePatient.name}`);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Control Panel Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Queue Controller</h1>
                    <p className="text-slate-500">Manage the TV Display remotely</p>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    System Online
                </div>
            </div>

            {/* Main Active Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-6 flex justify-between items-center">
                    <span className="uppercase text-sm font-bold text-slate-500 tracking-wider">Now Serving</span>
                    <span className="text-primary font-mono font-bold text-xl">{activePatient.id}</span>
                </div>

                <div className="p-8 text-center py-12">
                    <div className="inline-block p-4 bg-sky-50 rounded-full mb-6">
                        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold">
                            JD
                        </div>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-2">{activePatient.name}</h2>
                    <div className="text-slate-500 mb-8">{activePatient.service} • {activePatient.dentist}</div>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() => handleAction("Recall")}
                            className="flex items-center gap-2 px-8 py-4 bg-yellow-100 text-yellow-700 rounded-xl font-bold hover:bg-yellow-200 transition-colors"
                        >
                            <Mic className="h-6 w-6" />
                            Recall Patient
                        </button>

                        <button
                            onClick={() => handleAction("Complete")}
                            className="flex items-center gap-2 px-8 py-4 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                        >
                            <CheckCircle className="h-6 w-6" />
                            Finish Treatment
                        </button>
                    </div>
                </div>
            </div>

            {/* Next Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waiting List */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        Next in Line <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs">4 Waiting</span>
                    </h3>
                    <div className="space-y-3">
                        {[
                            { id: "A103", name: "Alice Smith", wait: "5 min" },
                            { id: "B201", name: "Bob Wilson", wait: "12 min" },
                            { id: "A104", name: "Jane Cooper", wait: "20 min" },
                        ].map((p, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100 group hover:border-primary/30 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <span className="font-mono font-bold text-slate-400 group-hover:text-primary">{p.id}</span>
                                    <span className="font-medium text-slate-700">{p.name}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-mono">{p.wait}</span>
                                    <button className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-primary transition-colors">
                                        <SkipForward className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all text-left group">
                            <UserPlus className="h-6 w-6 text-slate-400 mb-2 group-hover:text-blue-500" />
                            <div className="font-bold">Add Walk-in</div>
                            <div className="text-xs text-slate-400">Register new patient</div>
                        </button>
                        <button className="p-4 bg-slate-50 border border-slate-200 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all text-left group">
                            <RefreshCcw className="h-6 w-6 text-slate-400 mb-2 group-hover:text-red-500" />
                            <div className="font-bold">Reset Queue</div>
                            <div className="text-xs text-slate-400">Clear all data</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
