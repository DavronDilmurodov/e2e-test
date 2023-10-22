import { Todo } from './todo.model';
import { User } from './user.model';

export const relations = () => {
  User.hasMany(Todo, { foreignKey: { name: 'user_id' } });
  Todo.belongsTo(User, { foreignKey: { name: 'user_id' } });
};
