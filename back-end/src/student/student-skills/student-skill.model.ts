import { type InferAttributes, type InferCreationAttributes } from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'student_skills', timestamps: false, underscored: true })
export class StudentSkill extends Model<
    InferAttributes<StudentSkill>,
    InferCreationAttributes<StudentSkill>
> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'student_profiles', key: 'user_id' },
        onDelete: 'CASCADE',
    })
    declare studentId: number;

    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: { model: 'skills', key: 'id' },
        onDelete: 'NO ACTION',
    })
    declare skillId: number;
}
