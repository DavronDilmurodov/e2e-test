import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { Todo } from '../models/todo.model';
import { User } from '../models/user.model';
import { TodoController } from './controller/todo.controller';
import { TodoService } from './service/todo.service';

@Module({
  imports: [SequelizeModule.forFeature([User, Todo])],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [SequelizeModule],
})
export class TodoModule {}
