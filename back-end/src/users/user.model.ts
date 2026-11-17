import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum.js';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model {
    @Column
    declare firstName: string;

    @Column
    declare lastName: string;

    @Column({
        unique: true,
        allowNull: false,
    })
    declare email: string;

    @Column({ allowNull: true })
    declare emailVerifiedAt: Date | null;

    @Column({ allowNull: false })
    declare passwordHash: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
    })
    declare role: UserRole;

    @Column({ allowNull: true })
    declare phone: string | null;

    @Column({ allowNull: true })
    declare phoneVerifiedAt: Date | null;

    @Column({ allowNull: true })
    declare avatarKey: string | null;

    @Column({ allowNull: false })
    declare city: string;

    @Column({ allowNull: false })
    declare postalCode: string;
}
