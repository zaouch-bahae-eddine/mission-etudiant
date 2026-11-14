import { Body, Controller, Delete, Get, Param, Post, Put, Query, StandardSchemaValidationPipe } from '@nestjs/common';
import { MissionsService } from './missions.service.js';
import { paginationFilterSchema, type PaginationFilterDto } from '../pagination/pagination.js';
import { type MissionDto, missionSchema } from './dto/mission.dto.js';
import { Mission } from './mission.model.js';

@Controller('mission')
export class MissionController {

    constructor(private readonly missionsService: MissionsService) {}

    @Get()
    async getAllMission(@Query({ schema: paginationFilterSchema }) query: PaginationFilterDto): Promise<Mission[]> {
        return await this.missionsService.findAll(query);
    }

    @Post()
    async createMission(@Body({ schema: missionSchema }) mission: MissionDto): Promise<Mission> {
        return await this.missionsService.create(mission);
    }

    @Put(':id')
    async updateMission(@Param('id') id: number, @Body({ schema: missionSchema }) mission: MissionDto): Promise<Mission | null> {
        return await this.missionsService.update(id, mission);
    }

    @Delete(':id')
    async deleteMission(@Param('id') id: number): Promise<boolean> {
        return await this.missionsService.delete(id);
    }
}
