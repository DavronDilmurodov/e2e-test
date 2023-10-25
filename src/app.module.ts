import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './user/user.module';
import { TodoModule } from './todo/todo.module';
import { User } from './user/entities/user.entity';
import { Todo } from './todo/entitites/todo.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      username: 'postgres',
      database: 'todo_nest',
      password: 'luntik553',
      entities: [User, Todo],
      synchronize: true,
    }),
    UserModule,
    TodoModule,
  ],
})
export class AppModule {}
