import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserService } from '../service/user.service';
import { AuthResponse, DeleteUser, UserResponse } from '../types/response.type';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    signUp: jest.fn((dto: CreateUserDto) => signUpRes),
    signIn: jest.fn((dto: CreateUserDto) => signInRes),
    findOne: jest.fn((id: number) => findOneRes),
    update: jest.fn((id: number, dto: UpdateUserDto) => userRes),
    remove: jest.fn((id: number) => userRes),
  };

  const signUpRes = {
    message: 'CREATED',
    body: {
      id: 1,
      password: '12345678',
      username: 'alex',
    },
    statusCode: 201,
  };

  const signInRes: AuthResponse = {
    message: 'OK',
    statusCode: 200,
  };

  const findOneRes: UserResponse = {
    message: 'OK',
    data: {
      id: 1,
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

  it('signUp method', () => {
    const dto: CreateUserDto = {
      password: '12345678',
      username: 'alex',
    };

    expect(controller.signUp(dto)).toStrictEqual(signUpRes);
  });

  it('signIn method', () => {
    const dto: CreateUserDto = {
      password: '12345678',
      username: 'alex',
    };

    expect(controller.signIn(dto)).toStrictEqual(signInRes);
  });

  it('findOne method', () => {
    expect(controller.findOne(1)).toStrictEqual(findOneRes);
  });

  it('update method', () => {
    const body: UpdateUserDto = {
      username: 'dada',
      password: 'mmdadak',
      newPassword: '89797979979',
    };

    expect(controller.update(9, body)).toStrictEqual(userRes);
  });

  it('delete method', () => {
    expect(controller.remove(18)).toStrictEqual(userRes);
  });
});
