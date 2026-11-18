import { StudentAvailabilitySpecHelper } from '../../student/availability/tests/student-availability-spec-helper.js';
import { StudentProfileSpecHelper } from '../../student/profile/tests/student-profile-spec-helper.js';
import { StudentSkillSpecHelper } from '../../student/student-skills/tests/student-skill-spec-helper.js';
import { UserSpecHelper } from '../../users/tests/user-spec-helper.js';

export class RegistrationSpecHelper {
    registrationData = async (override: any = {}) => {
        const { user, profile, availability, skills } = override;
        return {
            user: new UserSpecHelper().userData(user ? { ...user } : {}),
            profile: new StudentProfileSpecHelper().profileData(
                profile
                    ? {
                          ...profile,
                      }
                    : {},
            ),
            availability: [
                new StudentAvailabilitySpecHelper().availabilityData(
                    availability
                        ? {
                              ...availability,
                          }
                        : {},
                ),
                new StudentAvailabilitySpecHelper().availabilityData(
                    availability
                        ? {
                              ...availability,
                          }
                        : {},
                ),
            ],
            skills:
                skills ??
                (await Promise.all([
                    new StudentSkillSpecHelper().createStudentSkillSpec(),
                    new StudentSkillSpecHelper().createStudentSkillSpec(),
                ])),
        };
    };
}
