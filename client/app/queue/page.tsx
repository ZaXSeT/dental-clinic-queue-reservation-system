"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ArrowLeft } from "lucide-react";

interface QueueItem {
    queueNumber: number;
    patientName: string;
    estWait: string;
}

interface CurrentQueue {
    queueNumber: number;
    patientName: string;
    status: string;
    room: number;
}

export default function QueueBoardPage() {
    const [current, setCurrent] = useState<CurrentQueue | null>(null);
    const [upcoming, setUpcoming] = useState<QueueItem[]>([]);
    const [time, setTime] = useState("");

    useEffect(() => {
        // Clock
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        // Fetch Initial Data
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3001/queue/live");
                const data = await res.json();
                setCurrent(data.current);
                setUpcoming(data.next);
            } catch (e) {
                console.error("Failed to fetch queue", e);
                // Demo Fallback
                setCurrent({ queueNumber: 102, patientName: "John Doe", status: "IN_TREATMENT", room: 1 });
                setUpcoming([
                    { queueNumber: 103, patientName: "Alice Smith", estWait: "15 mins" },
                    { queueNumber: 104, patientName: "Bob Jones", estWait: "30 mins" },
                    { queueNumber: 105, patientName: "Charlie Day", estWait: "45 mins" },
                ]);
            }
        };

        fetchData();
        // Socket.IO listener would go here for real-time updates

        return () => clearInterval(timer);
    }, []);

    return (
        <main className="min-h-screen bg-white text-slate-800 overflow-hidden p-8 flex gap-8">
            {/* Left: Active Patient (Main Focus) */}
            <section className="flex-1 flex flex-col">
                <header className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="p-3 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all border border-slate-200 hover:shadow-md group" aria-label="Back to Home">
                            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                        </Link>
                        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-primary">
                            <div className="h-10 w-10 bg-primary" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                            <span>Dental</span>
                        </div>
                    </div>
                    <div className="text-6xl font-mono font-bold text-slate-900">{time}</div>
                </header>

                <div className="flex-1 flex flex-col justify-center items-center bg-sky-50 rounded-[3rem] border-8 border-white shadow-2xl shadow-sky-100 p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 w-full h-2 bg-primary"></div>
                    <h2 className="text-4xl text-slate-400 uppercase tracking-[0.2em] mb-8 font-semibold">Now Serving</h2>

                    <div className="text-[14rem] leading-none font-black text-primary mb-4 tracking-tighter drop-shadow-sm">
                        A{current?.queueNumber}
                    </div>

                    <div className="text-6xl font-bold text-slate-900 mb-12">
                        {current?.patientName}
                    </div>

                    <div className="flex items-center gap-4 bg-white px-10 py-6 rounded-full text-3xl border border-slate-200 shadow-lg">
                        <span className="w-5 h-5 rounded-full bg-green-500 animate-pulse box-shadow-green"></span>
                        <span className="font-medium text-slate-700">Room {current?.room}</span>
                        <span className="w-px h-8 bg-slate-300 mx-2"></span>
                        <span className="font-bold text-slate-900">Dr. Sarah Wilson</span>
                    </div>
                </div>
            </section>

            {/* Right: Upcoming List */}
            <aside className="w-[450px] flex flex-col bg-slate-50 rounded-[2.5rem] border border-slate-200 p-8 shadow-xl">
                <h3 className="text-3xl font-bold mb-10 flex items-center gap-4 text-slate-800">
                    <Clock className="text-primary h-10 w-10" /> Up Next
                </h3>

                <div className="space-y-6">
                    {upcoming.map((item, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-3xl flex justify-between items-center border border-slate-100 shadow-sm relative overflow-hidden group">
                            <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-200 group-first:bg-primary transition-colors"></div>
                            <div>
                                <div className="text-4xl font-black text-slate-800 mb-1">A{item.queueNumber}</div>
                                <div className="text-xl text-slate-500 font-medium">{item.patientName}</div>
                            </div>
                            <div className="text-right bg-slate-50 px-4 py-2 rounded-lg">
                                <span className="block text-sm text-slate-400 uppercase font-bold tracking-wider mb-1">Est. Wait</span>
                                <span className="text-2xl font-mono font-bold text-primary">{item.estWait}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto pt-8 border-t border-slate-200 text-center">
                    <div className="bg-white p-4 rounded-xl inline-block shadow-sm border border-slate-100">
                        {/* Placeholder QR */}
                        <div className="w-32 h-32 bg-slate-900 rounded-lg mx-auto mb-2"></div>
                        <p className="text-slate-500 text-sm font-medium">Scan to Check-in</p>
                    </div>
                </div>
            </aside>
        </main>
    );
}
