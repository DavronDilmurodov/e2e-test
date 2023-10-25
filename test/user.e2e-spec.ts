import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { AuthResponse, DeleteUser } from '../src/user/types/response.type';
import { AppModule } from '../src/app.module';

describe('User (e2e)', () => {
  let app: INestApplication;

  const userRes = {
    message: 'CREATED',
    data: {
      id: 2,
      username: 'potter',
      password: '9999999999',
    },
    statusCode: 201,
  };

  const findOne = {
    message: 'OK',
    statusCode: 200,
    data: {
      id: 2,
      username: 'potter',
      password: '9999999999',
    },
  };

  const signinRes: AuthResponse = {
    message: 'OK',
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
        expect(body).toStrictEqual(userRes);
      });
  });

  it('/user/signin (POST)', () => {
    const body: CreateUserDto = {
      username: 'potter',
      password: '9999999999',
    };

    return request(app.getHttpServer())
      .post('/user/signin')
      .send(body)
      .expect(({ body }) => {
        expect(body).toStrictEqual(signinRes);
      });
  });

  it('/user/2 (GET)', () => {
    return request(app.getHttpServer())
      .get('/user/2')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(findOne);
      });
  });

  it('/user/2 (PUT)', () => {
    const body: UpdateUserDto = {
      username: 'ronaldo',
      password: '9999999999',
      newPassword: '77777777',
    };
    return request(app.getHttpServer())
      .put('/user/2')
      .send(body)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(updateRes);
      });
  });

  it('/user/2 (DELETE)', () => {
    return request(app.getHttpServer())
      .delete('/user/2')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual(deleteRes);
      });
  });
});
