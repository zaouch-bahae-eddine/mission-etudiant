import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model.js';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private readonly userModel: typeof User ) {}

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findOne(id: number): Promise<User | null> {
        return this.userModel.findByPk(id);
    }

    async create(user: Partial<User>): Promise<User> {
        return this.userModel.create(user);
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
