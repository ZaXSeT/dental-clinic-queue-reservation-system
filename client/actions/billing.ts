'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { verifySession } from './auth';

export async function getAllProducts() {
    return prisma.product.findMany({
        orderBy: { name: 'asc' }
    });
}

export async function createInvoice(
    appointmentId: string,
    customTreatment?: string,
    customFee?: number
) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            include: { patient: true, doctor: true }
        });

        if (!appointment) return { success: false, error: "Appointment not found" };

        const count = await prisma.invoice.count();
        const invoiceNumber = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
        const billingCode = Math.floor(Math.random() * 90000000 + 10000000).toString();

        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                billingCode,
                appointmentId,
                patientId: appointment.patientId,
                totalAmount: 0,
                status: 'unpaid'
            }
        });

        const description = customTreatment || appointment.treatment || "General Consultation";
        const price = customFee !== undefined ? customFee : 200000;

        await prisma.invoiceItem.create({
            data: {
                invoiceId: invoice.id,
                description: `Consultation & Treatment: ${description}`,
                quantity: 1,
                price: price,
                type: 'service'
            }
        });

        await prisma.invoice.update({
            where: { id: invoice.id },
            data: { totalAmount: price }
        });

        revalidatePath('/admin/appointments');
        revalidatePath('/admin/billing');
        return { success: true, invoiceId: invoice.id };
    } catch (error) {
        console.error("Failed to create invoice:", error);
        return { success: false, error: "Database error" };
    }
}

export async function addInvoiceItem(invoiceId: string, item: {
    description: string,
    quantity: number,
    price: number,
    type: string,
    productId?: string
}) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await prisma.invoiceItem.create({
            data: {
                invoiceId,
                description: item.description,
                quantity: item.quantity,
                price: item.price,
                type: item.type,
                productId: item.productId
            }
        });

        // Recalculate total
        const items = await prisma.invoiceItem.findMany({ where: { invoiceId } });
        const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { totalAmount: total }
        });

        revalidatePath('/admin/billing');
        return { success: true };
    } catch (error) {
        console.error("Failed to add item:", error);
        return { success: false, error: "Database error" };
    }
}

export async function deleteInvoiceItem(itemId: string, invoiceId: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await prisma.invoiceItem.delete({
            where: { id: itemId }
        });

        // Recalculate total
        const items = await prisma.invoiceItem.findMany({ where: { invoiceId } });
        const total = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { totalAmount: total }
        });

        revalidatePath(`/admin/billing/${invoiceId}`);
        revalidatePath('/admin/billing');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete item:", error);
        return { success: false, error: "Database error" };
    }
}

export async function getInvoiceDetails(invoiceId: string) {
    return prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: {
            patient: true,
            appointment: {
                include: { doctor: true }
            },
            items: {
                include: { product: true }
            }
        }
    });
}

export async function markInvoiceAsPaid(invoiceId: string) {
    const session = await verifySession();
    if (!session) return { success: false, error: "Unauthorized" };

    try {
        await prisma.invoice.update({
            where: { id: invoiceId },
            data: { status: 'paid' }
        });
        revalidatePath('/admin/billing');
        return { success: true };
    } catch (error) {
        console.error("Failed to mark as paid:", error);
        return { success: false, error: "Database error" };
    }
}
