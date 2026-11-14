import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
} from 'sequelize-typescript';
import { UserRole } from './enums/user-role.enum.js';


@Table({ tableName: 'users' })
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

  @Column({ allowNull: false })
  declare passwordHash: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  declare role: UserRole;
}
