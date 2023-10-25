import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteTodo, TodoResponse } from '../types/response.type';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { ErrorResponse } from '../../types/error.type';
import { Todo } from '../entitites/todo.entity';
import { User } from '../../user/entities/user.entity';

Injectable();
export class TodoService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async getTodos(id: number): Promise<object> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { id },
        relations: {
          todos: true,
        },
      });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      return {
        message: 'OK',
        data: foundUser,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }

  async createTodo(
    id: number,
    body: CreateTodoDto,
  ): Promise<TodoResponse | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOneBy({ id });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      console.log(1);

      const createdTodo = this.todoRepository.create({
        title: body.title,
        text: body.text,
        user: foundUser,
      });

      console.log(createdTodo);

      await this.todoRepository.save(createdTodo);

      console.log(2);

      return {
        message: 'CREATED',
        data: createdTodo,
        statusCode: 201,
      };
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }

  async updateTodo(
    userId: number,
    todoId: number,
    { text, title }: UpdateTodoDto,
  ): Promise<DeleteTodo | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOneBy({ id: userId });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoRepository.findOne({
        where: { id: todoId },
        relations: {
          user: true,
        },
      });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user.id !== userId) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to update this todo',
        );
      }

      await this.todoRepository.update({ id: todoId }, { title, text });

      return {
        message: 'UPDATED',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }

  async deleteTodo(
    userId: number,
    todoId: number,
  ): Promise<DeleteTodo | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOneBy({ id: userId });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoRepository.findOne({
        where: { id: todoId },
        relations: {
          user: true,
        },
      });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user.id !== userId) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to delete this todo',
        );
      }

      await this.todoRepository.remove(foundTodo);

      return {
        message: 'DELETED',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }

  async isCompleted(
    userId: number,
    todoId: number,
  ): Promise<DeleteTodo | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOneBy({ id: userId });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoRepository.findOne({
        where: { id: todoId },
        relations: {
          user: true,
        },
      });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user.id !== userId) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to change isCompleted in this todo',
        );
      }

      if (foundTodo.isCompleted === false) {
        await this.todoRepository.update({ id: todoId }, { isCompleted: true });
        return {
          message: 'UPDATED',
          statusCode: 200,
        };
      } else if (foundTodo.isCompleted === true) {
        await this.todoRepository.update(
          { id: todoId },
          { isCompleted: false },
        );
        return {
          message: 'UPDATED',
          statusCode: 200,
        };
      }
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }
}
