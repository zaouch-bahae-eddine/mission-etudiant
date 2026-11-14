import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'missions',
  timestamps: true,
  underscored: true,
})
export class Mission extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare datetime: Date;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  declare price: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare location: string;
}
