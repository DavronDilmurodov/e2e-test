import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';

import { TodoService } from '../service/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get(':id')
  getTodos(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.getTodos(id);
  }

  @Post(':id')
  createTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTodoDto,
  ) {
    return this.todoService.createTodo(id, body);
  }

  @Put(':userId/:todoId')
  updatedTodo(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
    @Body() body: UpdateTodoDto,
  ) {
    return this.todoService.updateTodo(userId, todoId, body);
  }

  @Put('isCompleted/:userId/:todoId')
  isCompleted(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ) {
    return this.todoService.isCompleted(userId, todoId);
  }

  @Delete(':userId/:todoId')
  deleteTodo(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('todoId', ParseIntPipe) todoId: number,
  ) {
    return this.todoService.deleteTodo(userId, todoId);
  }
}
