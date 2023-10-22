import { TodoType } from 'src/todo/types/todo.type';

export interface UserType {
  id: number;
  username: string;
  password: string;
  Todos: TodoType[] | [];
  createdAt: Date;
  updatedAt: Date;
}
