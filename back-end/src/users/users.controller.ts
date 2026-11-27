import {
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import {
    userSchema,
    type UserUpdateDto,
    UserUpdateSchema,
    type UserDto,
} from './dto/user.dto.js';
import {
    paginationFilterSchema,
    type PaginationFilterDto,
} from '../pagination/pagination.js';
import { User } from './user.model.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwtAuth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserRole } from './enums/user-role.enum.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Roles([UserRole.CLIENT, UserRole.STUDENT])
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAllUsers(
        @Query({ schema: paginationFilterSchema }) query: PaginationFilterDto,
    ) {
        return await this.usersService.findAll(query);
    }

    @Post()
    async createUser(@Body({ schema: userSchema }) user: UserDto) {
        return this.usersService.create(user);
    }

    @Patch(':id')
    async updateUser(
        @Param('id') userId: number,
        @Body({ schema: UserUpdateSchema }) user: UserUpdateDto,
        @CurrentUser() currentUser: User
    ) {
        if(currentUser.id !== userId) {
            throw new HttpException('Action not allowed', HttpStatus.FORBIDDEN);
        }
        const passwordHash = user.password
            ? await this.usersService.hashPassword(user.password)
            : undefined;

        return this.usersService.update(userId, { ...user, passwordHash });
    }

    // TO-DO: Admin only
    @Delete(':id')
    async deleteUser(@Param('id') id: number) {
        return this.usersService.delete(id);
    }
}
