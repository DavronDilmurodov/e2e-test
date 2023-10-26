import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  Req,
} from '@nestjs/common';

import { TodoService } from '../service/todo.service';
import { CreateTodoDto } from '../dto/create-todo.dto';
import { UpdateTodoDto } from '../dto/update-todo.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('todos')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'user and his todos' })
  @Get()
  getTodos(@Req() req) {
    const token = req.token;
    return this.todoService.getTodos(token);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiCreatedResponse({ description: 'todo was created' })
  @Post()
  createTodo(@Req() req, @Body() body: CreateTodoDto) {
    const token = req.token;
    return this.todoService.createTodo(token, body);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'todo was updated' })
  @Put(':id')
  updatedTodo(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateTodoDto,
  ) {
    const token = req.token;
    return this.todoService.updateTodo(token, id, body);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'isCompleted of todo was updated' })
  @Put('isCompleted/:id')
  isCompleted(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const token = req.token;
    return this.todoService.isCompleted(token, id);
  }

  @ApiBearerAuth('JWT-auth')
  @ApiOkResponse({ description: 'todo was deleted' })
  @Delete(':id')
  deleteTodo(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const token = req.token;
    return this.todoService.deleteTodo(token, id);
  }
}
