
import { getTestingModule } from '../../test/setup.js';
import { RegistrationService } from '../registration.service.js';
import { RegistrationSpecHelper } from './registration-spec-helper.js';

describe('RegistrationService', () => {
    let service: RegistrationService;
    let registrationHelper: RegistrationSpecHelper;

    beforeAll(async () => {
        service = getTestingModule().get<RegistrationService>(
            RegistrationService,
        );
       
        registrationHelper = new RegistrationSpecHelper();
    });

    it.concurrent('should be defined', () => {
        expect(service).toBeDefined();
    });

    it.concurrent('should register a student', async () => {
        const studentData = await registrationHelper.registrationData()
        const student = service.registerStudent(studentData)
    });
});
