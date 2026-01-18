import { prisma } from "@/lib/prisma";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AppointmentsPage() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Appointments Management</h2>
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-500">
                <p>Appointments list will appear here.</p>
            </div>
        </div>
    );
}
