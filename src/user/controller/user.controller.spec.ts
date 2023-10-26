import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { AuthResponse, DeleteUser, UserResponse } from '../types/response.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    signUp: jest.fn((dto: CreateUserDto) => signUpRes),
    signIn: jest.fn((dto: CreateUserDto) => signInRes),
    findOne: jest.fn((token: string) => findOneRes),
    update: jest.fn((token: string, dto: UpdateUserDto) => userRes),
    remove: jest.fn((token: string) => userRes),
  };

  const signUpRes = {
    message: 'CREATED',
    body: {
      id: expect.any(Number),
      password: '12345678',
      username: 'alex',
    },
    statusCode: 201,
  };

  const signInRes: AuthResponse = {
    message: 'OK',
    statusCode: 200,
  };

  const findOneRes = {
    message: 'OK',
    data: {
      id: expect.any(Number),
      username: 'alex',
      password: '12345678',
    },
    statusCode: 200,
  };

  const userRes: DeleteUser = {
    message: 'UPDATED',
    statusCode: 200,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  // it('signUp method', () => {
  //   const dto: CreateUserDto = {
  //     password: '12345678',
  //     username: 'alex',
  //   };

  //   expect(controller.signUp(dto)).toStrictEqual(signUpRes);
  // });

  it('signIn method', () => {
    const dto: CreateUserDto = {
      password: '12345678',
      username: 'alex',
    };

    expect(controller.signIn(dto)).toStrictEqual(signInRes);
  });

  it('findOne method', () => {
    expect(controller.findOne('hello world')).toStrictEqual(findOneRes);
  });

  // it('update method', () => {
  //   const body: UpdateUserDto = {
  //     username: 'dada',
  //     password: 'mmdadak',
  //     newPassword: '89797979979',
  //   };

  //   expect(controller.update(9, body)).toStrictEqual(userRes);
  // });

  it('delete method', () => {
    expect(controller.remove('hello world')).toStrictEqual(userRes);
  });
});
