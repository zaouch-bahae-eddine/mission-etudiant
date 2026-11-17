import { getTestingModule } from '../../../test/setup.js';
import { StudentProfileSpecHelper } from '../../profile/tests/student-profile-spec-helper.js';
import { StudentAvailabilityService } from '../student-availability.service.js';
import {
    type StudentAvailabilityDto,
    type StudentAvailabilityUpdateDto,
} from '../dto/student-availability.dto.js';

export class StudentAvailabilitySpecHelper {
    service = getTestingModule().get(StudentAvailabilityService);

    availabilityData(overrides: Partial<StudentAvailabilityDto> = {}) {
        return {
            dayOfWeek: 1,
            startTime: '09:00:00',
            endTime: '12:00:00',
            ...overrides,
        };
    }

    async createStudentAvailabilitySpec(
        overrides: Partial<StudentAvailabilityDto> = {},
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
