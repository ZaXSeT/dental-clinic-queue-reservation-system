"use client";

import { Users, Calendar, Clock, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Patients in Queue", val: "12", icon: Users, color: "bg-blue-500" },
                    { label: "Today's Appointments", val: "28", icon: Calendar, color: "bg-purple-500" },
                    { label: "Avg Wait Time", val: "14m", icon: Clock, color: "bg-orange-500" },
                    { label: "Revenue Today", val: "$2.4k", icon: TrendingUp, color: "bg-green-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className={`${stat.color} p-4 rounded-lg text-white`}>
                            <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-slate-900">{stat.val}</div>
                            <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity / Queue Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-800">Current Queue Status</h3>
                    <button className="text-sm text-primary font-medium hover:underline">View All</button>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700">Queue ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Patient Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Dentist</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {[
                            { id: "A102", name: "John Doe", dentist: "Dr. Sarah", status: "In Treatment", time: "10:30 AM", statusColor: "bg-green-100 text-green-700" },
                            { id: "A103", name: "Alice Smith", dentist: "Dr. Sarah", status: "Waiting", time: "10:45 AM", statusColor: "bg-blue-100 text-blue-700" },
                            { id: "B201", name: "Bob Wilson", dentist: "Dr. Mike", status: "Waiting", time: "11:00 AM", statusColor: "bg-blue-100 text-blue-700" },
                            { id: "A104", name: "Jane Cooper", dentist: "Dr. Sarah", status: "Checked In", time: "11:15 AM", statusColor: "bg-slate-100 text-slate-700" },
                        ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-900">{row.id}</td>
                                <td className="px-6 py-4 text-slate-600">{row.name}</td>
                                <td className="px-6 py-4 text-slate-600">{row.dentist}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${row.statusColor}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{row.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
