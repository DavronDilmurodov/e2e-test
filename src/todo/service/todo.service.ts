import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Todo } from '../../models/todo.model';
import { User } from '../../models/user.model';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import { ErrorResponse } from '../../types/error.type';
import { DeleteTodo, GetTodos, TodoResponse } from '../types/response.type';

Injectable();
export class TodoService {
  constructor(
    @InjectModel(Todo) private readonly todoModel: typeof Todo,
    @InjectModel(User) private readonly userModel: typeof User,
  ) {}

  async getTodos(id: number): Promise<GetTodos | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({ where: { id } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const todos = await foundUser.getTodos();

      return {
        message: 'OK',
        data: todos,
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
      const foundUser = await this.userModel.findOne({ where: { id } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      if (!body.text) {
        const createdTodo = await this.todoModel.create({
          title: body.title,
          user_id: id,
        });

        await foundUser.addTodo(createdTodo);

        return {
          message: 'CREATED',
          data: createdTodo,
          statusCode: 201,
        };
      }

      const createdTodo = await this.todoModel.create({
        title: body.title,
        text: body.text,
        user_id: id,
      });

      await foundUser.addTodo(createdTodo);

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
  ): Promise<TodoResponse | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({ where: { id: userId } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoModel.findOne({ where: { id: todoId } });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user_id !== userId) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to update this todo',
        );
      }

      if (!title && !text) {
        HttpStatus.BAD_REQUEST;
        throw new BadRequestException('edit something');
      } else if (title && text) {
        if (title.length < 2 || title.length > 20) {
          HttpStatus.BAD_REQUEST;
          throw new BadRequestException(
            'length of title should be more than 2 and less than 20',
          );
        }

        const updatedTodo = await foundTodo.update({ title, text });
        return {
          message: 'UPDATED',
          data: updatedTodo,
          statusCode: 200,
        };
      } else if (title && !text) {
        if (title.length < 2 || title.length > 20) {
          HttpStatus.BAD_REQUEST;
          throw new BadRequestException(
            'length of title should be more than 2 and less than 20',
          );
        }

        const updatedTodo = await foundTodo.update({ title });
        return {
          message: 'UPDATED',
          data: updatedTodo,
          statusCode: 200,
        };
      } else if (!title && text) {
        const updatedTodo = await foundTodo.update({ text });

        return {
          message: 'UPDATED',
          data: updatedTodo,
          statusCode: 200,
        };
      }
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
      const foundUser = await this.userModel.findOne({ where: { id: userId } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoModel.findOne({ where: { id: todoId } });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user_id !== userId) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to delete this todo',
        );
      }

      await foundTodo.destroy();

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
  ): Promise<TodoResponse | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({ where: { id: userId } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundTodo = await this.todoModel.findOne({ where: { id: todoId } });

      if (!foundTodo) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('todo not found');
      }

      if (foundTodo.user_id !== userId) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException(
          'you do not have an access to change isCompleted in this todo',
        );
      }

      if (foundTodo.isCompleted === false) {
        const updatedTodo = await foundTodo.update({ isCompleted: true });
        return {
          message: 'UPDATED',
          data: updatedTodo,
          statusCode: 200,
        };
      } else if (foundTodo.isCompleted === true) {
        const updatedTodo = await foundTodo.update({ isCompleted: false });
        return {
          message: 'UPDATED',
          data: updatedTodo,
          statusCode: 200,
        };
      }
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }
}
