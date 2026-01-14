import { Controller, Get, Param } from '@nestjs/common';
import { DentistsService } from './dentists.service';

@Controller('dentists')
export class DentistsController {
    constructor(private readonly dentistsService: DentistsService) { }

    @Get()
    findAll() {
        return this.dentistsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.dentistsService.findOne(id);
    }
}
