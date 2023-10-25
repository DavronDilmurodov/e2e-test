import { UserType } from '../../user/types/user.type';
import { TodoType } from './todo.type';

export interface GetTodos {
  message: string;
  data?: UserType;
  statusCode: number;
}

export interface TodoResponse {
  message: string;
  data: TodoType;
  statusCode: number;
}

export interface DeleteTodo {
  message: string;
  statusCode: number;
}
