import { Module } from '@nestjs/common';
import { AppointmentsGateway } from './appointments/appointments.gateway';
import { PrismaModule } from './prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [],
    providers: [AppointmentsGateway],
})
export class AppModule { }
