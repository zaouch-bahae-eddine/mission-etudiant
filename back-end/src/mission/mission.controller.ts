import { Controller, Get } from '@nestjs/common';
import { MissionsService } from './missions.service.js';

@Controller('mission')
export class MissionController {

    constructor(private readonly missionsService: MissionsService) {}

    @Get()
    async getAllMission(): Promise<any[]> {
        return await this.missionsService.findAll();
    }
}
