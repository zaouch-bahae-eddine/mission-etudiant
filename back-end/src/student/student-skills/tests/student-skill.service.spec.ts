import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { getTestingModule } from '../../../test/setup.js';
import { StudentProfileService } from '../../profile/student-profile.service.js';
import { SkillService } from '../../skills/skill.service.js';
import { StudentSkillService } from '../student-skill.service.js';
import { StudentSkillSpecHelper } from './student-skill-spec-helper.js';

describe('StudentSkillService', () => {
    let service: StudentSkillService;
    let studentSkillHelper: StudentSkillSpecHelper;

    beforeAll(() => {
        service = getTestingModule().get(StudentSkillService);
        studentSkillHelper = new StudentSkillSpecHelper();
    });

    it.concurrent('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.concurrent(
        'should create and find an association using both identifiers',
        async () => {
            const { studentId, skillId } =
                await studentSkillHelper.createStudentSkillSpec();
            expect(await service.findOne(studentId, skillId)).toMatchObject({
                studentId,
                skillId,
            });
        },
    );

    it.concurrent(
        'should list only the associations for the requested student',
        async () => {
            const first = await studentSkillHelper.createStudentSkillSpec();
            const second = await studentSkillHelper.createStudentSkillSpec({
                studentId: first.studentId,
            });
            await studentSkillHelper.createStudentSkillSpec({
                skillId: first.skillId,
            });

            const associations = await service.findByStudent(first.studentId);
            expect(associations).toHaveLength(2);
            expect(associations.map(({ skillId }) => skillId)).toEqual(
                expect.arrayContaining([first.skillId, second.skillId]),
            );
        },
    );

    it.concurrent('should reject a duplicate association', async () => {
        const { studentId, skillId } =
            await studentSkillHelper.createStudentSkillSpec();
        await expect(
            service.create({ studentId, skillId }),
        ).rejects.toBeInstanceOf(UniqueConstraintError);
    });

    it.concurrent('should delete only the requested association', async () => {
        const { studentId, skillId } =
            await studentSkillHelper.createStudentSkillSpec();
        const otherSkill = await studentSkillHelper.createStudentSkillSpec({
            studentId,
        });
        const otherStudent = await studentSkillHelper.createStudentSkillSpec({
            skillId,
        });

        expect(await service.delete(studentId, skillId)).toBe(true);
        expect(await service.findOne(studentId, skillId)).toBeNull();
        expect(await service.delete(studentId, skillId)).toBe(false);
        expect(
            await service.findOne(studentId, otherSkill.skillId),
        ).not.toBeNull();
        expect(
            await service.findOne(otherStudent.studentId, skillId),
        ).not.toBeNull();
    });

    it.concurrent('should prevent deletion of a referenced skill', async () => {
        const { skillId } = await studentSkillHelper.createStudentSkillSpec();
        const skillService = getTestingModule().get(SkillService);

        await expect(skillService.delete(skillId)).rejects.toBeInstanceOf(
            ForeignKeyConstraintError,
        );
    });

    it.concurrent(
        'should delete associations when the student profile is deleted',
        async () => {
            const { studentId, skillId } =
                await studentSkillHelper.createStudentSkillSpec();
            const profileService = getTestingModule().get(
                StudentProfileService,
            );

            await profileService.deleteStudentProfile(studentId);
            expect(await service.findOne(studentId, skillId)).toBeNull();
        },
    );
});
