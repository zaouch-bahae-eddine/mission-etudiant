import { Body, Controller, Get, Query, StandardSchemaValidationPipe } from '@nestjs/common';
import { MissionsService } from './missions.service.js';
import { paginationFilterSchema, type PaginationFilterDto } from '../pagination/pagination.js';

@Controller('mission')
export class MissionController {

    constructor(private readonly missionsService: MissionsService) {}

    @Get()
    async getAllMission(@Body({ schema: paginationFilterSchema }) query: PaginationFilterDto): Promise<any[]> {
        return await this.missionsService.findAll(query);
    }
}
