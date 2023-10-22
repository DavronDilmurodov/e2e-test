import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { TodoModule } from '../src/todo/todo.module';
import { TodoResponse } from '../src/todo/types/response.type';
import { TodoService } from '../src/todo/service/todo.service';

describe('TodoController (e2e)', () => {
  let todo: INestApplication;
  let todoService = { findAll: () => [] };

  let todoResponse: TodoResponse;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TodoModule],
    })
      .overrideProvider(TodoService)
      .useValue(todoService)
      .compile();

    todo = moduleRef.createNestApplication();
    await todo.init();
  });

  it('/todo/:id (GET)', () => {
    return request(todo.getHttpServer()).get('/todo/:id').expect(200).expect({
      todoResponse,
    });
  });

  it('/todo/:id (POST)', () => {
    return request(todo.getHttpServer()).post('/todo/:id').expect(201);
  });

  it('/todo/:userId/:todoId', () => {
    return request(todo.getHttpServer())
      .put('/todo/:userId/:todoId')
      .expect(200);
  });

  afterAll(async () => {
    await todo.close();
  });
});
