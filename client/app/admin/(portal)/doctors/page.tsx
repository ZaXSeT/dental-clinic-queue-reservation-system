import { getAllDoctors } from "@/actions/doctor";
import DoctorsClient from "./DoctorsClient";

export default async function DoctorsPage() {
    const { data: doctors } = await getAllDoctors();

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Doctor Management</h1>
                <p className="text-slate-500 mt-2">Manage doctor profiles and weekly availability schedules.</p>
            </div>

            <DoctorsClient doctors={doctors || []} />
        </div>
    );
}
