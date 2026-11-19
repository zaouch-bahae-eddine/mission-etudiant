import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserSchema, type UserUpdateDto, UserUpdateSchema, type UserDto } from './dto/user.dto.js';
import { paginationFilterSchema, type PaginationFilterDto } from '../pagination/pagination.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers(@Query({ schema: paginationFilterSchema }) query: PaginationFilterDto) {
    return await this.usersService.findAll(query);
  }

  @Post()
  async createUser(@Body({ schema: UserSchema }) user: UserDto) {
    return this.usersService.create(user);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body({ schema: UserUpdateSchema }) user: UserUpdateDto,
  ) {
    const passwordHash = user.password
      ? await this.usersService.hashPassword(user.password)
      : undefined;

    return this.usersService.update(id, { ...user, passwordHash });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return this.usersService.delete(id);
  }
}
