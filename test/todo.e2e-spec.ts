import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import {
  DeleteTodo,
  GetTodos,
  TodoResponse,
} from '../src/todo/types/response.type';
import { AppModule } from '../src/app.module';
import { UpdateTodoDto } from '../src/todo/dto/update-todo.dto';
import { CreateTodoDto } from '../src/todo/dto/create-todo.dto';

describe('TodoController (e2e)', () => {
  let app: INestApplication;

  let todoResponse = {
    message: 'CREATED',
    data: {
      id: 1,
      title: 'wake',
      text: 'wake up',
      isCompleted: false,
      user: {
        id: 1,
        username: 'alex',
        password: '9999999999',
      },
    },
    statusCode: 201,
  };

  const getTodosRes: GetTodos = {
    message: 'OK',
    statusCode: 200,
    data: {
      id: 1,
      username: 'alex',
      password: '88888888',
      todos: [
        {
          id: 1,
          title: 'wake',
          text: 'wake up',
          isCompleted: false,
        },
      ],
    },
  };

  const updateTodoRes: DeleteTodo = {
    message: 'UPDATED',
    statusCode: 200,
  };

  const deleteTodoRes: DeleteTodo = {
    message: 'DELETED',
    statusCode: 200,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/todo/1 (POST)', () => {
    const body: CreateTodoDto = {
      title: 'wake',
      text: 'wake up',
    };
    return request(app.getHttpServer())
      .post('/todo/1')
      .send(body)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toStrictEqual(todoResponse);
      });
  });

  it('/todo/1 (GET)', () => {
    return request(app.getHttpServer())
      .get('/todo/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(getTodosRes);
      });
  });

  it('/todo/1/1 (PUT)', () => {
    const body: UpdateTodoDto = {
      title: 'sleep',
      text: 'sleeep',
    };

    return request(app.getHttpServer())
      .put('/todo/1/1')
      .send(body)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(updateTodoRes);
      });
  });

  it('/todo/isCompleted/1/1', () => {
    return request(app.getHttpServer())
      .put('/todo/isCompleted/1/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(updateTodoRes);
      });
  });

  it('/todo/1/1', () => {
    return request(app.getHttpServer())
      .delete('/todo/1/1')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(deleteTodoRes);
      });
  });
});
