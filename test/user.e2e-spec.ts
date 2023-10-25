import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from '../src/user/dto/create-user.dto';
import { UpdateUserDto } from '../src/user/dto/update-user.dto';
import { UserService } from '../src/user/service/user.service';

import * as request from 'supertest';
import { UserResponse } from 'src/user/types/response.type';
import { AppModule } from '../src/app.module';

describe('User (e2e)', () => {
  let app: INestApplication;
  //   let userService: {
  //     signUp: jest.fn((dto: CreateUserDto) => signUpRes),
  //     signIn: jest.fn((dto: CreateUserDto) => signInRes),
  //     findOne: jest.fn((id: number) => findOneRes),
  //     update: jest.fn((id: number, dto: UpdateUserDto) => userRes),
  //     remove: jest.fn((id: number) => userRes),
  // };

  const userRes: UserResponse = {
    message: 'CREATED',
    data: {
      id: 7,
      username: 'dariusss',
      password: '779979797',
    },
    statusCode: 201,
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
      username: 'dariusss',
      password: '779979797',
    };

    return request(app.getHttpServer())
      .post('/user/signup')
      .send(body)
      .expect(201)
      .expect(({ body }) => {
        expect(body.data).toStrictEqual(userRes);
      });
  });
});
