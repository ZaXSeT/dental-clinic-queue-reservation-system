import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        
        
        

        
        console.log("Creating appointment...", data);

        

        return { success: true, id: 'mock-id-123' };
    }

    async findAll() {
        
        return [];
    }
}
