import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QueueService {
    constructor(private prisma: PrismaService) { }

    
    async getTodayQueue() {
        
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
        
        return { success: true, message: "Called next patient" };
    }
}
