import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { Todo } from './models/todo.model';
import { User } from './models/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      username: 'postgres',
      database: 'todo_nest',
      password: 'luntik553',
      // models: [Todo, User],
    }),
    UserModule,
    TodoModule,
  ],
})
export class AppModule {}
