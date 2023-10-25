import { Module } from '@nestjs/common';

import { TodoController } from './controller/todo.controller';
import { TodoService } from './service/todo.service';
import { Todo } from './entitites/todo.entity';
import { User } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User, Todo])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
