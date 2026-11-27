import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model.js';
import { PaginationFilterDto } from '../pagination/pagination.js';
import { type Transaction } from 'sequelize';
import { type UserDto } from './dto/user.dto.js';
import bcrypt from 'bcryptjs';
import { UserRole } from './enums/user-role.enum.js';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: typeof User) {}

    async findAll(paginationfilter: PaginationFilterDto): Promise<User[]> {
        return this.userModel.findAll({
            limit: paginationfilter.limit,
            offset: (paginationfilter.page - 1) * paginationfilter.limit,
            order: paginationfilter.sortBy
                ? [
                      [
                          paginationfilter.sortBy,
                          paginationfilter.sortOrder || 'ASC',
                      ],
                  ]
                : undefined,
        });
    }

    async findOne(id: number): Promise<User | null> {
        return this.userModel.findByPk(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { email },
        });
    }

    async findByUserProviderId(userProviderId: string): Promise<User | null> {
        return this.userModel.findOne({
            where: { userProviderId },
        });
    }

    async create(user: UserDto): Promise<User> {
        return this.userModel.create({
            ...user,
            passwordHash: await this.hashPassword(user.password),
        });
    }

    async update(userId: number, user: Partial<User>): Promise<User | null> {
        const [affectedRows] = await this.userModel.update(user, {
            where: { id: userId },
        });
        if (affectedRows === 0) {
            return null;
        }
        return this.findOne(userId);
    }

    async delete(id: number): Promise<boolean> {
        const deletedRows = await this.userModel.destroy({
            where: { id },
        });
        return deletedRows > 0;
    }

    async hashPassword(password: string): Promise<string> {
        const bcrypt = await import('bcryptjs');
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
}
