import { Model, DataType, Column, Table } from 'sequelize-typescript';

@Table({ tableName: 'student_profiles', timestamps: true, underscored: true })
export class StudentProfile extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
    })
    declare userId: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare bio: string | null;

    @Column({
        type: DataType.STRING(255),
        allowNull: true,
    })
    declare university: string | null;

    @Column({
        type: DataType.STRING(255),
        field: 'study_field',
        allowNull: true,
    })
    declare studentField: string | null;

    @Column({
        type: DataType.STRING(100),
        field: 'study_level',
        allowNull: true,
    })
    declare studentLevel: string | null;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    declare hasDrivingLicense: boolean | null;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
    })
    declare hasVehicle: boolean | null;

    @Column({
        type: DataType.INTEGER,
        allowNull: true,
    })
    declare travel_radius_km: number | null;

    @Column({
        type: DataType.DECIMAL(10, 2),
        allowNull: true,
    })
    declare hourly_rate: number | null;

    @Column({
        type: DataType.TEXT,
        allowNull: true,
    })
    declare experience: string | null;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: true,
        defaultValue: true,
    })
    declare isAvailable: boolean | null;

    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    declare studentVerifiedAt: Date | null;
}
