import { getAdminProfile, getClinicSettings } from '@/actions/settings';
import SettingsClient from './SettingsClient';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const [adminRes, clinicRes] = await Promise.all([
        getAdminProfile(),
        getClinicSettings()
    ]);

    const admin = adminRes.success && adminRes.data ? adminRes.data : null;
    const clinic = clinicRes.success && clinicRes.data ? clinicRes.data : null;

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                <p className="text-slate-500">System configuration and profile management.</p>
            </div>

            <SettingsClient admin={admin} clinic={clinic} />
        </div>
    );
}
