import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum.js';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model {
    toJSON(): object {
        const values = super.toJSON() as Record<string, unknown>;
        delete values.passwordHash;
        delete values.password_hash;
        return values;
    }

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

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare city: string | null;

    @Column({ type: DataType.STRING(10), allowNull: true })
    declare postalCode: string | null;

    @Column({ type: DataType.STRING(100), allowNull: true })
    declare userProviderId: string | null;

    @Column({ type: DataType.STRING(20), allowNull: true })
    declare provider: string | null;
}
