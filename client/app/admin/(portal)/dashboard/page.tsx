import { prisma } from "@/lib/prisma";
import { Users, Calendar, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns"; // Standard date formatting if available, or native Intl

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let patientCount = 0;
    let appointmentCount = 0;
    let waitingCount = 0;
    let recentQueues: any[] = [];
    let dbConnected = true;
    let errorMessage = "";

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const results = await Promise.all([
            prisma.patient.count(),
            prisma.appointment.count({ where: { date: { gte: today } } }),
            prisma.queue.count({ where: { date: { gte: today }, status: 'waiting' } }),
            prisma.queue.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                where: { date: { gte: today } },
                include: { patient: true }
            })
        ]);

        patientCount = results[0];
        appointmentCount = results[1];
        waitingCount = results[2];
        recentQueues = results[3];

    } catch (e) {
        console.error("Database connection failed", e);
        dbConnected = false;
        errorMessage = String(e);
    }

    const stats = [
        { label: "Patients (Total)", val: patientCount.toString(), icon: Users, color: "bg-blue-500" },
        { label: "Today's Appointments", val: appointmentCount.toString(), icon: Calendar, color: "bg-purple-500" },
        { label: "In Queue (Waiting)", val: waitingCount.toString(), icon: Clock, color: "bg-orange-500" },
        { label: "Revenue (Est.)", val: "$0", icon: TrendingUp, color: "bg-green-500" }, // specific logic needed for revenue
    ];

    if (!dbConnected) {
        return (
            <div className="p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Database Error:</strong>
                    <span className="block sm:inline whitespace-pre-wrap"> {errorMessage}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group cursor-default">
                        <div className="flex items-center gap-4">
                            <div className={`${stat.color} bg-opacity-10 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-slate-800 tracking-tight">{stat.val}</div>
                                <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">{stat.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Current Queue Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
                    <div>
                        <h3 className="font-bold text-lg text-slate-800">Live Queue Activity</h3>
                        <p className="text-sm text-slate-500">Real-time patient status updates</p>
                    </div>
                    <Link href="/queue" className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-100 hover:text-slate-900 transition-colors border border-slate-200">
                        View Full Queue
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Queue No.</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Patient Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 uppercase text-xs tracking-wider">Checked In</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentQueues.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="bg-slate-100 p-3 rounded-full mb-2">
                                                <Clock className="h-6 w-6 text-slate-300" />
                                            </div>
                                            No active queue recorded today.
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                recentQueues.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded text-xs border border-slate-200">#{row.number}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-700 font-medium group-hover:text-slate-900">
                                            {row.name || row.patient?.name || "Guest Patient"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${row.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                row.status === 'treating' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    row.status === 'waiting' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                        'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                {row.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                                            {format(new Date(row.createdAt), "h:mm a")}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
