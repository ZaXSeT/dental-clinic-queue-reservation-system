import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueueService {
    constructor(private prisma: PrismaService) { }

    // Get current active queue for the day
    async getTodayQueue() {
        // Mock Data for Phase 3/4 Demo
        return {
            current: {
                queueNumber: 102,
                patientName: "John Doe",
                status: "IN_TREATMENT",
                room: 1
            },
            next: [
                { queueNumber: 103, patientName: "Alice Smith", estWait: "15 mins" },
                { queueNumber: 104, patientName: "Bob Jones", estWait: "30 mins" },
            ]
        };
    }

    async callNext(dentistId: string) {
        // Logic to move queue head
        return { success: true, message: "Called next patient" };
    }
}
