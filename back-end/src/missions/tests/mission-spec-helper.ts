import { faker } from "@faker-js/faker";
import { MissionDto } from "../dto/mission.dto.js";
import { getTestingModule } from "../../test/setup.js";
import { MissionsService } from "../missions.service.js";


export class MissionSpecHelper {

    missionsService = getTestingModule().get<MissionsService>(MissionsService);
    missionData = (overrideData?: Partial<MissionDto>) => ({
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(),
        datetime: faker.date.future(),
        price: faker.commerce.price({ min: 10, max: 100 }),
        location: faker.location.city(),
        authorId: faker.number.int({ min: 1, max: 10 }),
        ...overrideData,
    });

    createMissionSpec = async (missionData: Partial<MissionDto>) => {
        return await this.missionsService.create(this.missionData(missionData));
    }

    updateMissionSpec = async (id: number, missionData: Partial<MissionDto>) => {
        return await this.missionsService.update(id, this.missionData(missionData));
    }
}