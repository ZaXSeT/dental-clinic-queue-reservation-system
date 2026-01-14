import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { AppointmentsGateway } from './appointments.gateway'; // Re-use the existing file

@Module({
    controllers: [AppointmentsController],
    providers: [AppointmentsService, AppointmentsGateway],
})
export class AppointmentsModule { }
