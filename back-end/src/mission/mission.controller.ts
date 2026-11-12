import { Controller, Get } from '@nestjs/common';

@Controller('mission')
export class MissionController {

    @Get()
    getAllMission(): string {
        return 'Mission data';
    }
}
