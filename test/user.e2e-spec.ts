import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { AuthResponse, DeleteUser } from '../src/user/types/response.type';
import { AppModule } from '../src/app.module';

describe('User (e2e)', () => {
  let app: INestApplication;
  let token: string;

  const userRes = {
    message: 'CREATED',
    data: {
      id: expect.any(Number),
      username: 'potter',
      password: '9999999999',
    },
    token: expect.any(String),
    statusCode: 201,
  };

  const findOne = {
    message: 'OK',
    statusCode: 200,
    data: {
      id: expect.any(Number),
      username: 'potter',
      password: '9999999999',
    },
  };

  const signinRes = {
    message: 'OK',
    data: {
      id: expect.any(Number),
      username: 'potter',
      password: '9999999999',
    },
    token: expect.any(String),
    statusCode: 200,
  };

  const updateRes: DeleteUser = {
    message: 'UPDATED',
    statusCode: 200,
  };

  const deleteRes: DeleteUser = {
    message: 'DELETED',
    statusCode: 200,
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY5ODMzNTc5NX0.be3y14EUL7yNnoRfjICej3ITxbRVITwMINhvt404brg';
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user/signup (POST)', () => {
    const body: CreateUserDto = {
      username: 'potter',
      password: '9999999999',
    };

    return request(app.getHttpServer())
      .post('/user/signup')
      .send(body)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toEqual(userRes);
      });
  });

  it('/user/signin (POST)', () => {
    const body: CreateUserDto = {
      username: 'luntikk',
      password: 'dmakmdkamdkamdka',
    };

    return request(app.getHttpServer())
      .post('/user/signin')
      .send(body)
      .expect(({ body }) => {
        expect(body).toEqual(expect.objectContaining(body));
      });
  });

  it('/user (GET)', () => {
    return request(app.getHttpServer())
      .get('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual(findOne);
      });
  });

  it('/user (PUT)', () => {
    const body: UpdateUserDto = {
      username: 'ronaldo',
      password: '9999999999',
      newPassword: '77777777',
    };
    return request(app.getHttpServer())
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send(body)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(updateRes);
      });
  });

  it('/user (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(deleteRes);
      });
  });
});
