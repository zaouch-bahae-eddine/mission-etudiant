import {
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
} from 'sequelize';
import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'skills', timestamps: false, underscored: true })
export class Skill extends Model<
    InferAttributes<Skill>,
    InferCreationAttributes<Skill>
> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id: CreationOptional<number>;

    @Column({ type: DataType.STRING(255), allowNull: false })
    declare name: string;
}
