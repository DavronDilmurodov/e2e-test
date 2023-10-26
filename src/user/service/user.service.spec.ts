import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserService } from './user.service';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthResponse, DeleteUser, UserResponse } from '../types/response.type';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn((entity) => entity),
    findOneBy: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    create: jest.fn((entity) => ({ id: 3, ...entity })),
    remove: jest.fn((entity) => entity),
    find: jest.fn((entity) => entity),
    update: jest.fn((entity) => entity),
  }),
);

const signUpRes = {
  message: 'CREATED',
  body: {
    id: expect.any(Number),
    password: '131313131',
    username: 'neymar',
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
    username: 'ronaldo',
    password: 'habksjndad',
  },
  statusCode: 200,
};

const userRes: DeleteUser = {
  message: 'UPDATED',
  statusCode: 200,
};

const removeRes: DeleteUser = {
  message: 'DELETED',
  statusCode: 200,
};

describe('UserService', () => {
  let service: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('signUp method', async () => {
    const body: CreateUserDto = {
      username: 'neymar',
      password: '131313131',
    };

    await expect(service.signUp(body, 'heloo')).resolves.toEqual(signUpRes);
  });

  it('signIn method', async () => {
    const body: CreateUserDto = {
      username: 'luntikk',
      password: 'dmakmdkamdkamdka',
    };

    await expect(service.signIn(body)).resolves.toEqual(signInRes);
  });

  it('findOne method', async () => {
    await expect(
      service.findOne(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY5ODMzNTc5NX0.be3y14EUL7yNnoRfjICej3ITxbRVITwMINhvt404brg',
      ),
    ).resolves.toEqual(findOneRes);
  });

  it('update method', async () => {
    const body: UpdateUserDto = {
      username: 'luntik',
      password: 'habksjndad',
      newPassword: 'heloo world',
    };

    await expect(
      service.update(
        body,
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY5ODMzNTc5NX0.be3y14EUL7yNnoRfjICej3ITxbRVITwMINhvt404brg',
        'smth',
      ),
    ).resolves.toEqual(userRes);
  });

  it('delete method', async () => {
    await expect(
      service.remove(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsImlhdCI6MTY5ODMzNTc5NX0.be3y14EUL7yNnoRfjICej3ITxbRVITwMINhvt404brg',
      ),
    ).resolves.toEqual(removeRes);
  });
});
