import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { DeleteTodo, GetTodos, TodoResponse } from '../types/response.type';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { ErrorResponse } from '../../types/error.type';
import { Todo } from '../entitites/todo.entity';
import { User } from '../../user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

Injectable();
export class TodoService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
    private jwtService: JwtService,
  ) {}

  async getTodos(token: string): Promise<GetTodos> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOne({
        where: {
          id: decodedtoken.id,
        },
        relations: { todos: true },
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
    token: string,
    body: CreateTodoDto,
  ): Promise<TodoResponse | ErrorResponse> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }
      const createdTodo = this.todoRepository.create({
        title: body.title,
        text: body.text,
        user: foundUser,
      });

      await this.todoRepository.save(createdTodo);

      console.log(createdTodo);

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
    token: string,
    id: number,
    { text, title }: UpdateTodoDto,
  ): Promise<DeleteTodo | ErrorResponse> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user.id !== foundUser.id) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to update this todo',
        );
      }

      await this.todoRepository.update(id, { title, text });

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
    token: string,
    id: number,
  ): Promise<DeleteTodo | ErrorResponse> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user.id !== foundUser.id) {
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
    token: string,
    id: number,
  ): Promise<DeleteTodo | ErrorResponse> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoRepository.findOne({
        where: { id },
        relations: {
          user: true,
        },
      });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user.id !== foundUser.id) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to change isCompleted of this todo',
        );
      }

      if (foundTodo.isCompleted === false) {
        await this.todoRepository.update({ id: id }, { isCompleted: true });
        return {
          message: 'UPDATED',
          statusCode: 200,
        };
      } else if (foundTodo.isCompleted === true) {
        await this.todoRepository.update({ id: id }, { isCompleted: false });
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
