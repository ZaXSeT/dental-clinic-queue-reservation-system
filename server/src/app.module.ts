import { Module } from '@nestjs/common';

import { PrismaModule } from './prisma/prisma.module';
import { DentistsModule } from './dentists/dentists.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { QueueModule } from './queue/queue.module';

@Module({
    imports: [PrismaModule, DentistsModule, AppointmentsModule, QueueModule],
    controllers: [],
    providers: [], // Gateway is now in AppointmentsModule
})
export class AppModule { }
