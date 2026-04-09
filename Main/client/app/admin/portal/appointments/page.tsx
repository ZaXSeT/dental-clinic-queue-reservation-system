import { getAppointments } from '@/actions/appointment';
import AppointmentsClient from './AppointmentsClient';

export const dynamic = 'force-dynamic';

export default async function AppointmentsPage() {
    const { success, data } = await getAppointments();
    const appointments = success && data ? data : [];

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
                <p className="text-slate-500">Manage patient bookings and schedule.</p>
            </div>

            <AppointmentsClient appointments={appointments} />
        </div>
    );
}
