import { getTestingModule } from '../../../test/setup.js';
import { StudentAvailabilityService } from '../student-availability.service.js';
import { StudentAvailabilitySpecHelper } from './student-availability-spec-helper.js';
import { StudentProfileSpecHelper } from '../../profile/tests/student-profile-spec-helper.js';
import { UserSpecHelper } from '../../../users/tests/user-spec-helper.js';

describe('StudentAvailabilityService', () => {
    let service: StudentAvailabilityService;
    let availabilityHelper: StudentAvailabilitySpecHelper;
    let userId: number;

    beforeAll(async () => {
        service = getTestingModule().get<StudentAvailabilityService>(
            StudentAvailabilityService,
        );
        availabilityHelper = new StudentAvailabilitySpecHelper();
        const userHelper = new UserSpecHelper();
    });

    it.concurrent('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.concurrent('should create a new student availability', async () => {
        const availability =
            await availabilityHelper.createStudentAvailabilitySpec({
                dayOfWeek: 3,
                startTime: '09:00:00',
                endTime: '12:00:00',
            });

        const foundAvailability = await service.findOne(availability.id);
        expect(foundAvailability?.dayOfWeek).toEqual(3);
        expect(foundAvailability?.startTime).toEqual('09:00:00');
        expect(foundAvailability?.endTime).toEqual('12:00:00');
    });

    it.concurrent('should return a student availability by id', async () => {
        const availability =
            await availabilityHelper.createStudentAvailabilitySpec();
        const foundAvailability = await service.findOne(availability.id);

        expect(foundAvailability).not.toBeNull();
        expect(foundAvailability?.id).toEqual(availability.id);
        expect(foundAvailability?.studentId).toEqual(availability.studentId);
    });

    it.concurrent(
        'should return null when the availability does not exist',
        async () => {
            const availability =
                await availabilityHelper.createStudentAvailabilitySpec();
            await service.delete(availability.id);

            expect(await service.findOne(availability.id)).toBeNull();
        },
    );

    it.concurrent(
        'should update an existing student availability',
        async () => {
            const availability =
                await availabilityHelper.createStudentAvailabilitySpec();
            const updatedAvailability =
                await availabilityHelper.updateStudentAvailabilitySpec(
                    availability.id,
                    { dayOfWeek: 5, endTime: '14:30:00' },
                );

            expect(updatedAvailability?.dayOfWeek).toEqual(5);
            const foundAvailability = await service.findOne(availability.id);
            expect(foundAvailability?.endTime).toEqual('14:30:00');
            expect(foundAvailability?.startTime).toEqual(
                availability.startTime,
            );
            expect(foundAvailability?.studentId).toEqual(
                availability.studentId,
            );
        },
    );

    it.concurrent(
        'should return null when updating a deleted availability',
        async () => {
            const availability =
                await availabilityHelper.createStudentAvailabilitySpec();
            await service.delete(availability.id);

            expect(
                await availabilityHelper.updateStudentAvailabilitySpec(
                    availability.id,
                    { dayOfWeek: 2 },
                ),
            ).toBeNull();
        },
    );

    it.concurrent('should delete a student availability', async () => {
        const availability =
            await availabilityHelper.createStudentAvailabilitySpec();

        expect(await service.delete(availability.id)).toBe(true);
        expect(await service.findOne(availability.id)).toBeNull();
        expect(await service.delete(availability.id)).toBe(false);
    });
});
