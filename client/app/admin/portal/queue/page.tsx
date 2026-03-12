"use client";

import { useEffect, useState } from "react";
import { getQueueState, callNextPatient, completePatient, recallPatient, skipPatient, resetQueue, addWalkIn } from "@/actions/queue";
import { getAllDoctors } from "@/actions/doctor";

import RoomCard from "./components/RoomCard";
import NextInLine from "./components/NextInLine";
import QuickActions from "./components/QuickActions";
import WalkInModal from "./components/WalkInModal";
import ConfirmationModal from "./components/ConfirmationModal";

export default function QueueControlPage() {
    const [loading, setLoading] = useState(false);
    const [isSubmittingWalkIn, setIsSubmittingWalkIn] = useState(false);
    const [showWalkInModal, setShowWalkInModal] = useState(false);

    const [confirmation, setConfirmation] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'info' | 'danger' | 'success';
        action: () => Promise<void>;
    }>({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        action: async () => { },
    });

    const [data, setData] = useState<{
        activeQueues: any[];
        next: any[];
        waitingCount: number;
    }>({ activeQueues: [], next: [], waitingCount: 0 });

    const [doctors, setDoctors] = useState<any[]>([]);

    useEffect(() => {
        const fetchDoctors = async () => {
            const res = await getAllDoctors();
            if (res.success && res.data) {
                setDoctors(res.data);
            }
        };
        fetchDoctors();
    }, []);

    const dynamicRooms = [1, 2, 3].map((roomIdNum, index) => {
        const doc = doctors[index];
        return {
            id: roomIdNum.toString(),
            name: doc ? doc.name : `Doctor ${roomIdNum}`,
            label: `Room ${roomIdNum}`,
        };
    });

    const refreshData = async () => {
        try {
            const res = await getQueueState();
            if (res) setData(res);
        } catch (err) {
            console.error("Failed to refresh data:", err);
        }
    };

    useEffect(() => {
        refreshData();
        const interval = setInterval(refreshData, 5000);
        return () => clearInterval(interval);
    }, []);

    const triggerConfirmation = (title: string, message: string, type: 'info' | 'danger' | 'success', action: () => Promise<void>) => {
        setConfirmation({
            isOpen: true,
            title,
            message,
            type,
            action
        });
    };

    const handleCallNext = (roomId: string) => {
        if (data.waitingCount === 0) {
            alert("No patients waiting in queue!");
            return;
        }

        triggerConfirmation(
            "Call Next Patient?",
            `Are you sure you want to call the next patient to Room ${roomId}?`,
            "info",
            async () => {
                await callNextPatient(roomId);
                await refreshData();
            }
        );
    };

    const handleComplete = (id: string, name: string) => {
        triggerConfirmation(
            "Complete Treatment?",
            `Are you sure you want to finish treatment for ${name}? This will mark them as completed.`,
            "success",
            async () => {
                await completePatient(id);
                await refreshData();
            }
        );
    };

    const handleRecall = (id: string, name: string) => {
        triggerConfirmation(
            "Recall Patient",
            `Call ${name} to the room again?`,
            "info",
            async () => {
                await recallPatient(id);
            }
        );
    };

    const handleSkip = (id: string) => {
        triggerConfirmation(
            "Skip Patient",
            "Are you sure you want to skip this patient? They will be marked as skipped.",
            "danger",
            async () => {
                await skipPatient(id);
                await refreshData();
            }
        );
    };

    const handleReset = () => {
        triggerConfirmation(
            "Reset All Queues?",
            "DANGER: This will delete ALL today's queue data. This action cannot be undone. Are you absolutely sure?",
            "danger",
            async () => {
                await resetQueue();
                await refreshData();
            }
        );
    };

    const handleSubmitWalkIn = async (name: string, phone: string) => {
        setIsSubmittingWalkIn(true);
        try {
            await addWalkIn(name, phone);
            await refreshData();
            setShowWalkInModal(false);
        } catch (error) {
            alert("Failed to add walk-in patient");
        } finally {
            setIsSubmittingWalkIn(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Queue Controller</h1>
                    <p className="text-slate-500">Manage 3 consultation rooms</p>
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 border border-green-200">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live System
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {dynamicRooms.map((room) => {
                    const active = data.activeQueues.find((q: any) => q.roomId === room.id);
                    return (
                        <RoomCard
                            key={room.id}
                            room={room}
                            active={active}
                            isBusy={!!active}
                            loading={loading}
                            waitingCount={data.waitingCount}
                            onCallNext={handleCallNext}
                            onComplete={handleComplete}
                            onRecall={handleRecall}
                        />
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <NextInLine
                    next={data.next}
                    waitingCount={data.waitingCount}
                    onSkip={handleSkip}
                />

                <QuickActions
                    onAddWalkIn={() => setShowWalkInModal(true)}
                    onReset={handleReset}
                />
            </div>

            <WalkInModal
                isOpen={showWalkInModal}
                onClose={() => setShowWalkInModal(false)}
                onSubmit={handleSubmitWalkIn}
                isSubmitting={isSubmittingWalkIn}
            />

            <ConfirmationModal
                isOpen={confirmation.isOpen}
                title={confirmation.title}
                message={confirmation.message}
                type={confirmation.type}
                loading={loading}
                onClose={() => setConfirmation(prev => ({ ...prev, isOpen: false }))}
                onConfirm={async () => {
                    setLoading(true);
                    try {
                        await confirmation.action();
                        setConfirmation(prev => ({ ...prev, isOpen: false }));
                    } catch (error) {
                        alert("Action failed");
                    } finally {
                        setLoading(false);
                    }
                }}
            />
        </div>
    );
}
