import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
    constructor(private readonly appointmentsService: AppointmentsService) { }

    @Post()
    create(@Body() createAppointmentDto: any) {
        // In real app, DTO would validate fields
        return this.appointmentsService.create(createAppointmentDto);
    }

    @Get()
    findAll() {
        return this.appointmentsService.findAll();
    }
}
