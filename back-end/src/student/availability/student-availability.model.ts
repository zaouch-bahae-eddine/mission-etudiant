import {
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
} from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'student_availabilities',
    timestamps: false,
    underscored: true,
})
export class StudentAvailability extends Model<
    InferAttributes<StudentAvailability>,
    InferCreationAttributes<StudentAvailability>
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: CreationOptional<number>;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        references: { model: 'student_profiles', key: 'user_id' },
        onDelete: 'CASCADE',
    })
    declare studentId: number;

    @Column({
        type: DataType.SMALLINT,
        allowNull: false,
        validate: { isInt: true, min: 1, max: 7 },
    })
    declare dayOfWeek: number;

    @Column({
        type: DataType.TIME,
        allowNull: false,
        get(this: StudentAvailability) {
            return this.getDataValue('startTime')?.slice(0, 5);
        },
    })
    declare startTime: string;

    @Column({
        type: DataType.TIME,
        allowNull: false,
        get(this: StudentAvailability) {
            return this.getDataValue('endTime')?.slice(0, 5);
        },
    })
    declare endTime: string;
}
