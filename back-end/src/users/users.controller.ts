import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UserSchema, type UserDto } from './dto/user.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Post()
  async createUser(@Body({ schema: UserSchema }) user: UserDto) {
    const passwordHash = await this.usersService.hashPassword(user.password);
    return this.usersService.create({ ...user, passwordHash });
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: number,
    @Body({ schema: UserSchema }) user: UserDto,
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
