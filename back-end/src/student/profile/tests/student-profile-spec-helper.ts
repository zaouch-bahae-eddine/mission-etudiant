import { faker } from '@faker-js/faker';
import { getTestingModule } from '../../../test/setup.js';
import { UserSpecHelper } from '../../../users/tests/user-spec-helper.js';
import { StudentProfileService } from '../student-profile.service.js';
import {
    type StudentProfileDto,
    type StudentProfileUpdateDto,
} from '../dto/student-profile.dto.js';

export class StudentProfileSpecHelper {
    service = getTestingModule().get(StudentProfileService);

    profileData(overrides: Partial<StudentProfileDto> = {}) {
        return {
            bio: faker.lorem.sentence(),
            university: 'Université de Paris',
            ...overrides,
        };
    }

    async createStudentProfileSpec(overrides: Partial<StudentProfileDto> = {}) {
        const userId =
            overrides.userId ??
            (await new UserSpecHelper().createUserSpec()).id;
        return this.service.create({ ...this.profileData(overrides), userId });
    }

    updateStudentProfileSpec(userId: number, data: StudentProfileUpdateDto) {
        return this.service.updateStudentProfile(userId, data);
    }
}
