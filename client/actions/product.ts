'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

export async function createProduct(data: { name: string, price: number, description?: string, stock?: number }) {
    const session = await verifySession();
    if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                price: data.price,
                description: data.description,
                stock: data.stock || 0
            }
        });
        revalidatePath('/admin/billing');
        return { success: true, product };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { success: false, error: "Database error" };
    }
}

export async function updateProduct(id: string, data: { name?: string, price?: number, description?: string, stock?: number }) {
    const session = await verifySession();
    if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        const product = await prisma.product.update({
            where: { id },
            data: {
                ...data
            }
        });
        revalidatePath('/admin/billing');
        return { success: true, product };
    } catch (error) {
        console.error("Failed to update product:", error);
        return { success: false, error: "Database error" };
    }
}

export async function deleteProduct(id: string) {
    const session = await verifySession();
    if (!session || (session.role !== 'owner' && session.role !== 'admin')) {
        return { success: false, error: "Unauthorized" };
    }

    try {
        await prisma.product.delete({
            where: { id }
        });
        revalidatePath('/admin/billing');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, error: "Database error" };
    }
}
