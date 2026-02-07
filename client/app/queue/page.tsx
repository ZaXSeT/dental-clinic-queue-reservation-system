"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ArrowLeft } from "lucide-react";
import { getQueueState } from "@/actions/queue";
import { getAllDoctors } from "@/actions/doctor";

interface QueueItem {
    queueNumber: number | string;
    patientName: string;
    estWait: string;
    status?: string;
}

interface CurrentQueue {
    queueNumber: number | string;
    patientName: string;
    status: string;
    room: number | string;
    doctorName?: string;
}

export default function QueueBoardPage() {
    const [rooms, setRooms] = useState<any[]>([
        { id: "1", name: "Loading...", status: "Available" },
        { id: "2", name: "Loading...", status: "Available" },
        { id: "3", name: "Loading...", status: "Available" },
    ]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [upcoming, setUpcoming] = useState<QueueItem[]>([]);
    const [time, setTime] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        const fetchDoctors = async () => {
            const res = await getAllDoctors();
            if (res.success && res.data) {
                setDoctors(res.data);
            }
        };
        fetchDoctors();

    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getQueueState();

                const updatedRooms = [1, 2, 3].map((roomIdNum, index) => {
                    const doc = doctors[index];
                    const doctorName = doc ? doc.name : `Doctor ${roomIdNum}`;

                    const baseRoom = { id: roomIdNum.toString(), name: doctorName };

                    const active = data.activeQueues.find((q: any) => q.roomId === baseRoom.id);
                    if (active) {
                        return {
                            ...baseRoom,
                            queueNumber: active.number,
                            patientName: active.name || active.patient?.name || "Guest",
                            status: "Busy",
                        };
                    }
                    return { ...baseRoom, status: "Available" };
                });

                setRooms(updatedRooms);

                setUpcoming(data.next.map((item: any) => ({
                    queueNumber: item.number,
                    patientName: item.name || item.patient?.name || "Guest",
                    estWait: "Wait...",
                    status: item.status === 'scheduled' ? 'Scheduled' : 'Waiting'
                })));
            } catch (e) {
                console.error("Failed to fetch queue", e);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 3000);
        return () => clearInterval(interval);
    }, [doctors]);

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAdmin = () => {
            const cookies = document.cookie.split(';');
            const adminToken = cookies.find(c => c.trim().startsWith('admin_token='));
            setIsAdmin(!!adminToken);
        };
        checkAdmin();
    }, []);

    const handleBack = () => {
        if (isAdmin) {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/';
        }
    };

    return (
        <main className="h-screen max-h-screen bg-slate-50 text-slate-800 overflow-hidden flex flex-col">
            <header className="bg-white/80 backdrop-blur-md px-10 py-6 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-6">
                    {isAdmin && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-3 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl group flex items-center gap-2"
                            aria-label="Back to Admin Dashboard"
                        >
                            <span className="font-bold text-sm">Admin Panel</span>
                        </button>
                    )}
                    {!isAdmin && (
                        <Link href="/" className="p-3 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-all border border-slate-200 hover:shadow-md group" aria-label="Back">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    )}
                    <div className="flex items-center gap-3 text-2xl font-bold tracking-tight text-primary">
                        <div className="h-10 w-10 bg-primary shadow-lg shadow-primary/20" style={{ maskImage: 'url(/resources/clean.png)', WebkitMaskImage: 'url(/resources/clean.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }}></div>
                        <span className="text-slate-800">Dental<span className="text-primary">Clinic</span></span>
                    </div>
                </div>
                <div className="text-5xl font-mono font-bold text-slate-800 tracking-tight">{time}</div>
            </header>

            <div className="flex-1 flex gap-8 p-8 overflow-hidden">
                <section className="flex-1 grid grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <div key={room.id} className={`rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500 ${room.status === 'Busy' ? 'bg-white shadow-xl shadow-primary/5 border-2 border-primary/10' : 'bg-slate-100/50 border border-slate-200 opacity-80'}`}>
                            {room.status === 'Busy' && <div className="absolute top-0 w-full h-2 bg-primary"></div>}

                            <div className="mb-6">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider uppercase ${room.status === 'Busy' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                                    {room.status === 'Busy' ? 'Now Serving' : 'Available'}
                                </span>
                            </div>

                            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6 shadow-inner">
                                <span className="text-4xl font-bold text-slate-400">R{room.id}</span>
                            </div>

                            {room.status === 'Busy' ? (
                                <>
                                    <div className="text-[8rem] leading-none font-black text-primary mb-4 tracking-tighter drop-shadow-sm">
                                        #{room.queueNumber}
                                    </div>
                                    <div className="text-3xl font-bold text-slate-900 mb-8 line-clamp-1">
                                        {room.patientName}
                                    </div>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col justify-center mb-8">
                                    <div className="text-5xl text-slate-300 font-bold mb-2">--</div>
                                    <div className="text-xl text-slate-400">Waiting for patient</div>
                                </div>
                            )}

                            <div className="mt-auto pt-6 border-t border-slate-100 w-full">
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Doctor</div>
                                <div className="text-xl font-bold text-slate-800">{room.name}</div>
                            </div>
                        </div>
                    ))}
                </section>

                <aside className="w-[400px] h-full max-h-full flex flex-col bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-xl overflow-hidden">
                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3 text-slate-800">
                        <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                            <Clock className="h-6 w-6" />
                        </div>
                        Queue List
                    </h3>

                    <div className="space-y-4 overflow-y-auto pr-2 flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                        {upcoming.length === 0 ? (
                            <div className="text-center text-slate-400 py-10">All caught up!</div>
                        ) : (
                            upcoming.map((item, idx) => (
                                <div key={idx} className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center border border-slate-100 group">
                                    <div>
                                        <div className="text-3xl font-black text-slate-800 mb-1">#{item.queueNumber}</div>
                                        <div className="text-lg text-slate-500 font-medium">{item.patientName}</div>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Status</span>
                                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${item.status === 'Scheduled' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-primary'}`}>
                                            {item.status || "Waiting"}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}
