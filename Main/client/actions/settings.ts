'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { verifySession } from './auth';

export async function getAdminProfile() {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const admin = await prisma.admin.findFirst({
            where: { id: session.id }
        });
        if (!admin) return { success: false, error: "No admin found" };

        return {
            success: true,
            data: {
                id: admin.id,
                name: admin.name,
                username: admin.username,
                role: admin.role
            }
        };
    } catch (error) {
        return { success: false, error: "Failed to fetch profile" };
    }
}

export async function updateAdminProfile(id: string, data: { name?: string, username?: string, password?: string }) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const updateData: any = { ...data };

        if (data.password) {
            updateData.password = await bcrypt.hash(data.password, 10);
        }

        await prisma.admin.update({
            where: { id },
            data: updateData
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Update failed:", error);
        return { success: false, error: "Failed to update profile" };
    }
}

export async function getClinicSettings() {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
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
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const existing = await prisma.clinicSettings.findFirst();

        if (existing) {
            await prisma.clinicSettings.update({
                where: { id: existing.id },
                data: data
            });
        } else {
            await prisma.clinicSettings.create({ data });
        }

        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Error updating clinic settings:", error);
        return { success: false, error: "Failed to update clinic info" };
    }
}
