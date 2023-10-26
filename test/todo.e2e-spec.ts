import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { DeleteTodo } from '../src/todo/types/response.type';
import { AppModule } from '../src/app.module';
import { UpdateTodoDto } from '../src/todo/dto/update-todo.dto';
import { CreateTodoDto } from '../src/todo/dto/create-todo.dto';

describe('TodoController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  let todoResponse = {
    message: 'CREATED',
    data: {
      id: expect.any(Number),
      title: 'wake',
      text: 'wake up',
      isCompleted: false,
      user: {
        id: expect.any(Number),
        username: 'messi',
        password: '9797797997799779',
        avatar: '1698414549183___right.svg',
      },
    },
    statusCode: 201,
  };

  const getTodosRes = {
    message: 'OK',
    statusCode: 200,
    data: {
      id: expect.any(Number),
      username: 'messi',
      password: '9797797997799779',
      avatar: '1698414549183___right.svg',
      todos: [
        {
          id: expect.any(Number),
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

    authToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY5ODMzNTc5NX0.be3y14EUL7yNnoRfjICej3ITxbRVITwMINhvt404brg';
  });

  afterAll(async () => {
    await app.close();
  });

  it('/todo (POST)', () => {
    const body: CreateTodoDto = {
      title: 'wake',
      text: 'wake up',
    };
    return request(app.getHttpServer())
      .post('/todo')
      .set('Authorization', `Bearer ${authToken}`)
      .send(body)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toStrictEqual(todoResponse);
      });
  });

  it('/todo (GET)', () => {
    return request(app.getHttpServer())
      .get('/todo')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(getTodosRes);
      });
  });

  it('/todo/6 (PUT)', () => {
    const body: UpdateTodoDto = {
      title: 'sleep',
      text: 'sleeep',
    };

    return request(app.getHttpServer())
      .put('/todo/6')
      .set('Authorization', `Bearer ${authToken}`)
      .send(body)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(updateTodoRes);
      });
  });

  it('/todo/isCompleted/6', () => {
    return request(app.getHttpServer())
      .put('/todo/isCompleted/6')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(updateTodoRes);
      });
  });

  it('/todo/6', () => {
    return request(app.getHttpServer())
      .delete('/todo/6')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(deleteTodoRes);
      });
  });
});
