import { getAllDoctors } from "@/actions/doctor";
import DoctorsClient from "./DoctorsClient";
import { verifySession } from "@/actions/auth";

export default async function DoctorsPage() {
    const { data: doctors } = await getAllDoctors();
    const session = await verifySession();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Doctor Management</h1>
                <p className="text-slate-500 mt-2">Manage doctor profiles and weekly availability schedules.</p>
            </div>

            <DoctorsClient doctors={doctors || []} userRole={session?.role} />
        </div>
    );
}
