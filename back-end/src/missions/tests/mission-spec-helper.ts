import { Injectable } from "@nestjs/common";
import { MissionsService } from "../missions.service.js";
import { faker } from "@faker-js/faker";
import { MissionDto } from "../dto/mission.dto.js";

@Injectable()
export class MissionSpecHelper {

    constructor(private readonly missionsService: MissionsService) {}
    missionData = {
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        datetime: faker.date.future(),
        price: faker.commerce.price({ min: 10, max: 100 }),
        location: faker.location.city(),
        authorId: faker.number.int({ min: 1, max: 10 }),
    };

    createMissionSpec = async (missionData: Partial<MissionDto>) => {
        return await this.missionsService.create({ ...this.missionData, ...missionData });
    }

    updateMissionSpec = async (id: number, missionData: Partial<MissionDto>) => {
        return await this.missionsService.update(id, { ...this.missionData, ...missionData });
    }
}