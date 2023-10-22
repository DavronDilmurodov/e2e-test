import { TodoType } from './todo.type';

export interface GetTodos {
  message: string;
  data: TodoType[] | [];
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
