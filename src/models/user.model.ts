import {
  Model,
  DataTypes,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
} from 'sequelize';
import { sequelize } from '../config/db.config';
import { Todo } from './todo.model';
import { CreateTodoDto } from '../todo/dto/create-todo.dto';

export class User extends Model {
  declare id: number;
  declare username: string;
  declare password: string;
  declare Todos: Array<Todo>;

  declare createdAt: Date;
  declare updatedAt: Date;

  declare getTodos: HasManyGetAssociationsMixin<Todo>;
  declare addTodo: HasManyAddAssociationMixin<Todo, CreateTodoDto>;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 30],
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 20],
      },
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);
