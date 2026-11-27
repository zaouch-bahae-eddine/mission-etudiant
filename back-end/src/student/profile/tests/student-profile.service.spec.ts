import { getTestingModule } from '../../../test/setup.js';
import { StudentProfileService } from '../student-profile.service.js';
import { StudentProfileSpecHelper } from './student-profile-spec-helper.js';
import { UserSpecHelper } from '../../../users/tests/user-spec-helper.js';

describe.sequential('StudentProfileService', () => {
    let service: StudentProfileService;
    let profileHelper: StudentProfileSpecHelper;
    let userHelper: UserSpecHelper;
    let userId: number;

    beforeAll(async () => {
        service = getTestingModule().get<StudentProfileService>(
            StudentProfileService,
        );
        profileHelper = new StudentProfileSpecHelper();
        userHelper = new UserSpecHelper();
        userId = (await userHelper.createUserSpec()).id;
    });

    beforeEach(async () => {
        await service.deleteStudentProfile(userId);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new student profile', async () => {
        const profile = await profileHelper.createStudentProfileSpec({
            userId,
            bio: 'New student profile',
            studentField: 'Informatique',
            studentLevel: 'Licence',
        });
        expect(profile.userId).toEqual(userId);
        expect(profile.bio).toEqual('New student profile');
        const foundProfile = await service.findByUserId(userId);
        expect(foundProfile?.studentField).toEqual('Informatique');
        expect(foundProfile?.studentLevel).toEqual('Licence');
    });

    it('should return a student profile by user id', async () => {
        const profile = await profileHelper.createStudentProfileSpec({
            userId,
        });
        const foundProfile = await service.findByUserId(profile.userId);
        expect(foundProfile).not.toBeNull();
        expect(foundProfile?.userId).toEqual(profile.userId);
        expect(foundProfile?.bio).toEqual(profile.bio);
    });

    it('should return null when the user has no student profile', async () => {
        expect(await service.findByUserId(userId)).toBeNull();
    });

    it('should update an existing student profile', async () => {
        const profile = await profileHelper.createStudentProfileSpec({
            userId,
            university: 'Paris',
        });
        const profiles = await profileHelper.updateStudentProfileSpec(
            profile.userId,
            {
                bio: 'Updated student profile',
                hasVehicle: true,
            },
        );

        const updatedProfile = await service.findByUserId(profile.userId);
        expect(updatedProfile?.bio).toEqual('Updated student profile');
        expect(updatedProfile?.hasVehicle).toBe(true);
        expect(updatedProfile?.university).toEqual('Paris');
    });

    it('should return no updated rows when the profile does not exist', async () => {
        expect(
            await profileHelper.updateStudentProfileSpec(-1, {
                bio: 'Missing',
            }),
        ).toBe(undefined);
    });

    it('should delete a student profile', async () => {
        const profile = await profileHelper.createStudentProfileSpec({
            userId,
        });
        expect(await service.deleteStudentProfile(profile.userId)).toEqual(1);
        expect(await service.findByUserId(profile.userId)).toBeNull();
        expect(await service.deleteStudentProfile(profile.userId)).toEqual(0);
    });
});
