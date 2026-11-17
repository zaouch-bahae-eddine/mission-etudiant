import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum.js';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model {
    @Column(DataType.STRING(100))
    declare firstName: string;

    @Column(DataType.STRING(100))
    declare lastName: string;

    @Column({
        unique: true,
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare email: string;

    @Column({ type: DataType.DATE, allowNull: true })
    declare emailVerifiedAt: Date | null;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare passwordHash: string;

    @Column({
        type: DataType.ENUM(...Object.values(UserRole)),
        allowNull: false,
    })
    declare role: UserRole;

    @Column({ type: DataType.STRING(13), allowNull: true })
    declare phone: string | null;

    @Column({ type: DataType.DATE, allowNull: true })
    declare phoneVerifiedAt: Date | null;

    @Column({ type: DataType.TEXT, allowNull: true })
    declare avatarKey: string | null;

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare city: string;

    @Column({ type: DataType.STRING(10), allowNull: false })
    declare postalCode: string;
}
