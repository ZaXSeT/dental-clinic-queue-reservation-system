'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- Admin Profile ---
export async function getAdminProfile() {
    try {
        const admin = await prisma.admin.findFirst();
        if (!admin) return { success: false, error: "No admin found" };

        return {
            success: true,
            data: {
                id: admin.id,
                name: admin.name,
                username: admin.username,
            }
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch profile" };
    }
}

export async function updateAdminProfile(id: string, data: { name?: string, username?: string, password?: string }) {
    try {
        await prisma.admin.update({
            where: { id },
            data: data
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

// --- Clinic Info ---
export async function getClinicSettings() {
    try {
        // Find first or create default
        let settings = await prisma.clinicSettings.findFirst();

        if (!settings) {
            settings = await prisma.clinicSettings.create({
                data: {
                    name: "Dental Clinic",
                    address: "Clinic Address",
                    phone: "+62 800 0000 000"
                }
            });
        }

        return { success: true, data: settings };
    } catch (error) {
        console.error("Error fetching clinic settings:", error);
        return { success: false, error: "Failed to fetch settings" };
    }
}

export async function updateClinicSettings(data: { name: string, address: string, phone: string, email?: string }) {
    try {
        // Upsert approach: update the first one found, or create new if somehow empty (though get handles create)
        // Since we don't know the ID easily without fetching, let's fetch first.
        const existing = await prisma.clinicSettings.findFirst();

        if (existing) {
            await prisma.clinicSettings.update({
                where: { id: existing.id },
                data: data
            });
        } else {
            await prisma.clinicSettings.create({ data });
        }

        revalidatePath('/admin'); // Revalidate admin layout as it might use clinic name
        return { success: true };
    } catch (error) {
        console.error("Error updating clinic settings:", error);
        return { success: false, error: "Failed to update clinic info" };
    }
}
