import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model.js';
import { PaginationFilterDto } from '../pagination/pagination.js';
import { type Transaction } from 'sequelize';
import { type UserDto } from './dto/user.dto.js';
import bcrypt from 'bcryptjs';

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

    async create(user: UserDto, transaction?: Transaction): Promise<User> {
        return this.userModel.create(
            { ...user, passwordHash: await this.hashPassword(user.password) },
            { transaction },
        );
    }

    async update(id: number, user: Partial<User>): Promise<User | null> {
        const [affectedRows] = await this.userModel.update(user, {
            where: { id },
        });
        if (affectedRows === 0) {
            return null;
        }
        return this.findOne(id);
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
