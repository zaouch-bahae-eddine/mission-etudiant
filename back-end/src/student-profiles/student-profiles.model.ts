import { Model } from 'sequelize';
import { Column, Table } from 'sequelize-typescript';

@Table({ tableName: 'student_profiles', timestamps: true, underscored: true })
export class StudentProfile extends Model {
    @Column({
        allowNull: false,
    })
    declare userId: number;

    @Column({
        allowNull: true,
    })
    declare bio: string | null;

    @Column({
        allowNull: true,
    })
    declare university: string | null;

    @Column({
        allowNull: true,
    })
    declare studentField: string | null;

    @Column({
        allowNull: true,
    })
    declare studentLevel: string | null;

    @Column({
        allowNull: true,
    })
    declare hasDrivingLicense: boolean | null;

    @Column({
        allowNull: true,
    })
    declare hasVehicle: boolean | null;

    @Column({
        allowNull: true,
    })
    declare travel_radius_km: number | null;

    @Column({
        allowNull: true,
    })
    declare hourly_rate: number | null;

    @Column({
        allowNull: true,
    })
    declare experience: string | null;

    @Column({
        allowNull: true,
        defaultValue: true,
    })
    declare isAvailable: boolean | null;

    @Column({
        allowNull: true,
    })
    declare studentVerifiedAt: Date | null;
}
