import { Model, DataTypes, ForeignKey } from 'sequelize';
import { sequelize } from '../config/db.config';
import { User } from './user.model';

export class Todo extends Model {
  declare id: number;
  declare title: string;
  declare text: string;
  declare isCompleted: boolean;
  declare user_id: ForeignKey<User['id']>;

  declare createdAt: Date;
  declare updatedAt: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 20],
      },
    },

    text: {
      type: DataTypes.STRING,
    },

    isCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'todos',
  },
);
