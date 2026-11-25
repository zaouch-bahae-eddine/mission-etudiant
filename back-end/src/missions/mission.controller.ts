import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    StandardSchemaValidationPipe,
    UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service.js';
import {
    paginationFilterSchema,
    type PaginationFilterDto,
} from '../pagination/pagination.js';
import {
    type MissionDto,
    missionSchema,
    type MissionUpdateDto,
    missionUpdateSchema,
} from './dto/mission.dto.js';
import { Mission } from './mission.model.js';
import { JwtAuthGuard } from '../auth/jwtAuth.guard.js';
import { Roles } from '../auth/roles.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('mission')
export class MissionController {
    constructor(private readonly missionsService: MissionsService) {}

    @Get()
    @Roles(['student', 'particular'])
    async getAllMission(
        @Query({ schema: paginationFilterSchema }) query: PaginationFilterDto,
    ): Promise<Mission[]> {
        return await this.missionsService.findAll(query);
    }

    @Post()
    @Roles(['particular'])
    async createMission(
        @Body({ schema: missionSchema }) mission: MissionDto,
    ): Promise<Mission> {
        return await this.missionsService.create(mission);
    }

    @Put(':id')
    @Roles(['particular'])
    async updateMission(
        @Param('id') id: number,
        @Body({ schema: missionUpdateSchema }) mission: MissionUpdateDto,
    ): Promise<Mission | null> {
        return await this.missionsService.update(id, mission);
    }

    @Delete(':id')
    @Roles(['particular'])
    async deleteMission(@Param('id') id: number): Promise<boolean> {
        return await this.missionsService.delete(id);
    }
}
