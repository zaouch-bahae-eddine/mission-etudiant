import { getTestingModule } from '../../../test/setup.js';
import { StudentProfileSpecHelper } from '../../profile/tests/student-profile-spec-helper.js';
import { SkillSpecHelper } from '../../skills/tests/skill-spec-helper.js';
import { type StudentSkillDto } from '../dto/student-skill.dto.js';
import { StudentSkillService } from '../student-skill.service.js';

export class StudentSkillSpecHelper {
    service = getTestingModule().get(StudentSkillService);

    async createStudentSkillSpec(overrides: Partial<StudentSkillDto> = {}) {
        const studentId =
            overrides.studentId ??
            (await new StudentProfileSpecHelper().createStudentProfileSpec())
                .userId;
        const skillId =
            overrides.skillId ??
            (await new SkillSpecHelper().createSkillSpec()).id;
        return this.service.create({ studentId, skillId });
    }
}
