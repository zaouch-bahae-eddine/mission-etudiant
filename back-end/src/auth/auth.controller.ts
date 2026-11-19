import { Body, Controller, Post } from "@nestjs/common";
import { RegistrationService } from "./registration.service.js";
import { studentRegistrationSchemaDto, type StudentRegistrationSchemaDto } from "../student/dto/student-schema.dto.js";

@Controller('auth')
export class AuthController {

    constructor(private readonly registrationService: RegistrationService) {}

    @Post('register/student')
    async registerStudent(@Body({ schema: studentRegistrationSchemaDto }) data: StudentRegistrationSchemaDto) {
        return await this.registrationService.registerStudent(data);
    }
}