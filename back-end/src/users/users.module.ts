import { Module } from '@nestjs/common';
import { Users } from './users.js';
import { UsersService } from './users.service.js';

@Module({
  providers: [Users, UsersService]
})
export class UsersModule {}
