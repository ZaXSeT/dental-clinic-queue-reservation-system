'use client';

import { useState } from 'react';
import { updateDoctorAvailability } from '@/actions/doctor';
import { Clock, Save, Plus, X, Calendar, ChevronDown, Check } from 'lucide-react';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

const HOURS = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
const AMPM = ['AM', 'PM'];

export default function DoctorsClient({ doctors }: { doctors: any[] }) {
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [schedule, setSchedule] = useState<Record<string, string[]>>({});
    const [isSaving, setIsSaving] = useState(false);

    const [addingSlotForDay, setAddingSlotForDay] = useState<string | null>(null);
    const [newTime, setNewTime] = useState({ hour: '09', minute: '00', period: 'AM' });

    const handleSelectDoctor = (doc: any) => {
        setSelectedDoctor(doc);
        try {
            const parsed = doc.availability ? JSON.parse(doc.availability) : {};
            DAYS.forEach(day => {
                if (!parsed[day]) parsed[day] = [];
            });
            setSchedule(parsed);
        } catch (e) {
            const empty: any = {};
            DAYS.forEach(day => empty[day] = []);
            setSchedule(empty);
        }
    };

    const openAddTimeModal = (day: string) => {
        setAddingSlotForDay(day);
        setNewTime({ hour: '09', minute: '00', period: 'AM' });
    };

    const handleConfirmAddTime = () => {
        if (!addingSlotForDay) return;

        const timeString = `${newTime.hour}:${newTime.minute} ${newTime.period}`;

        setSchedule(prev => {
            const currentSlots = prev[addingSlotForDay] || [];
            if (currentSlots.includes(timeString)) return prev;

            return {
                ...prev,
                [addingSlotForDay]: [...currentSlots, timeString].sort((a, b) => {
                    const parseTime = (t: string) => {
                        const [time, period] = t.split(' ');
                        let [h, m] = time.split(':').map(Number);
                        if (period === 'PM' && h !== 12) h += 12;
                        if (period === 'AM' && h === 12) h = 0;
                        return h * 60 + m;
                    };
                    return parseTime(a) - parseTime(b);
                })
            }
        });

        setAddingSlotForDay(null);
    };

    const handleRemoveTimeSlot = (day: string, index: number) => {
        setSchedule(prev => ({
            ...prev,
            [day]: prev[day].filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!selectedDoctor) return;
        setIsSaving(true);
        const res = await updateDoctorAvailability(selectedDoctor.id, schedule);
        setIsSaving(false);
        if (res.success) {
            selectedDoctor.availability = JSON.stringify(schedule);
            setSelectedDoctor(null);
        } else {
            alert("Failed to update: " + res.error);
        }
    };

    if (selectedDoctor) {
        return (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden relative min-h-[600px] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSelectedDoctor(null)}
                            className="bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-colors text-slate-500 hover:text-slate-800"
                        >
                            &larr; Back
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Manage Schedule</h2>
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                                <span className="text-primary">{selectedDoctor.name}</span>
                                <span>•</span>
                                <span>{selectedDoctor.specialization}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-primary hover:bg-sky-600 text-white px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</span>
                        ) : (
                            <><Save className="w-4 h-4" /> Save Changes</>
                        )}
                    </button>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1 bg-slate-50/30 overflow-y-auto">
                    {DAYS.map(day => (
                        <div key={day} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <span className="font-black text-slate-400 text-xs tracking-widest uppercase">{day}</span>
                                <button
                                    onClick={() => openAddTimeModal(day)}
                                    className="bg-white border border-slate-200 text-primary hover:bg-primary hover:text-white hover:border-primary p-1.5 rounded-lg transition-all shadow-sm active:scale-90"
                                    title="Add Time Slot"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-2 min-h-[120px] flex-1">
                                {schedule[day]?.length === 0 && (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2 opacity-60">
                                        <Clock className="w-8 h-8 stroke-[1.5]" />
                                        <span className="text-xs font-medium italic">No availability</span>
                                    </div>
                                )}
                                {schedule[day]?.map((time, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-slate-50 hover:bg-white border border-slate-100 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 shadow-sm group/item transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
                                            {time}
                                        </div>
                                        <button
                                            onClick={() => handleRemoveTimeSlot(day, idx)}
                                            className="text-slate-300 hover:text-red-500 p-1 rounded-md transition-colors opacity-0 group-hover/item:opacity-100"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {addingSlotForDay && (
                    <div className="absolute inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-slate-100 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Add Time Slot</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{addingSlotForDay}</p>
                                </div>
                                <button onClick={() => setAddingSlotForDay(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex gap-2 mb-8">
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Hour</label>
                                    <div className="relative">
                                        <select
                                            value={newTime.hour}
                                            onChange={(e) => setNewTime({ ...newTime, hour: e.target.value })}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-center"
                                        >
                                            {HOURS.map(h => <option key={h} value={h}>{h}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex items-center pt-5 text-slate-300 font-black text-xl">:</div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Min</label>
                                    <div className="relative">
                                        <select
                                            value={newTime.minute}
                                            onChange={(e) => setNewTime({ ...newTime, minute: e.target.value })}
                                            className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 font-bold text-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer text-center"
                                        >
                                            {MINUTES.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Period</label>
                                    <div className="flex p-1 bg-slate-100 rounded-xl h-[52px]">
                                        {AMPM.map(p => (
                                            <button
                                                key={p}
                                                onClick={() => setNewTime({ ...newTime, period: p })}
                                                className={`flex-1 rounded-lg text-xs font-black transition-all ${newTime.period === p ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirmAddTime}
                                className="w-full py-4 bg-primary hover:bg-sky-600 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <Check className="w-5 h-5" />
                                Add this time
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map(doc => (
                <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:shadow-xl hover:shadow-slate-200/40 hover:border-primary/20 transition-all group cursor-pointer relative overflow-hidden" onClick={() => handleSelectDoctor(doc)}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500 ease-out"></div>

                    <div className="flex items-center gap-5 mb-8 relative z-10">
                        <div className="h-20 w-20 rounded-2xl bg-slate-50 overflow-hidden relative border-2 border-white shadow-lg group-hover:rotate-3 transition-transform duration-300">
                            {doc.image ? (
                                <img src={doc.image} alt={doc.name} className="object-cover w-full h-full" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary text-2xl font-bold">
                                    {doc.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors leading-tight mb-1">{doc.name}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{doc.specialization}</p>
                        </div>
                    </div>

                    <button
                        className="w-full py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-primary hover:border-primary hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-md"
                    >
                        <Calendar className="w-4 h-4" />
                        Manage Schedule
                    </button>
                </div>
            ))}
        </div>
    );
}
