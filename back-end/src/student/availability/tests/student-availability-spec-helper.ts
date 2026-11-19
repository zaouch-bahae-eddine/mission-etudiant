import { getTestingModule } from '../../../test/setup.js';
import { StudentProfileSpecHelper } from '../../profile/tests/student-profile-spec-helper.js';
import { StudentAvailabilityService } from '../student-availability.service.js';
import {
    StudentAvailabilityRegistrationDto,
    type StudentAvailabilityCreateDto,
    type StudentAvailabilityUpdateDto,
} from '../dto/student-availability.dto.js';
import { faker } from '@faker-js/faker';

export class StudentAvailabilitySpecHelper {
    service = getTestingModule().get(StudentAvailabilityService);

    availabilityData(
        overrides?: Partial<StudentAvailabilityUpdateDto> & { studentId?: number },
    ): StudentAvailabilityCreateDto | StudentAvailabilityRegistrationDto {
        return {
            dayOfWeek: faker.number.int({ min: 1, max: 7 }),
            startTime: '09:00',
            endTime: '12:00',
            ...overrides,
        };
    }

    async createStudentAvailabilitySpec(
        overrides: Partial<StudentAvailabilityUpdateDto> & { studentId?: number } = {},
    ) {
        const studentId =
            overrides.studentId ??
            (await new StudentProfileSpecHelper().createStudentProfileSpec())
                .userId;
        return this.service.create({
            ...this.availabilityData(overrides),
            studentId,
        });
    }

    updateStudentAvailabilitySpec(
        id: number,
        data: StudentAvailabilityUpdateDto,
    ) {
        return this.service.update(id, data);
    }
}
