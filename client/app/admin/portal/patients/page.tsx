import { getPatients } from '@/actions/patient';
import PatientsClient from './PatientsClient';

export const dynamic = 'force-dynamic';

export default async function PatientsPage() {
    const { success, data } = await getPatients();
    const patients = success && data ? data : [];

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Patients Record</h1>
                <p className="text-slate-500">View and search patient database.</p>
            </div>

            <PatientsClient patients={patients} />
        </div>
    );
}
