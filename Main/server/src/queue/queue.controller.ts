import { Controller, Get, Post, Body } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('queue')
export class QueueController {
    constructor(private readonly queueService: QueueService) { }

    @Get('live')
    getLiveQueue() {
        return this.queueService.getTodayQueue();
    }

    @Post('next')
    callNext(@Body() body: { dentistId: string }) {
        return this.queueService.callNext(body.dentistId);
    }
}
