import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { AuthResponse, DeleteUser, UserResponse } from '../types/response.type';
import { ErrorResponse } from '../../types/error.type';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async signUp({
    password,
    username,
  }: CreateUserDto): Promise<AuthResponse | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { username },
      });

      if (foundUser) {
        HttpStatus.BAD_REQUEST;
        throw new BadRequestException('this username already busy');
      }

      const newUser = this.userRepository.create({
        username,
        password,
      });

      await this.userRepository.save(newUser);

      return {
        message: 'CREATED',
        data: newUser,
        statusCode: 201,
      };
    } catch (error) {
      console.log(error.message);
      return error.response;
    }
  }

  async signIn({
    password,
    username,
  }: CreateUserDto): Promise<AuthResponse | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOneBy({ username });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      if (foundUser.password != password) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException('wrong password or username');
      }

      HttpStatus.OK;

      return {
        message: 'OK',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async findOne(id: number): Promise<UserResponse | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOneBy({ id });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      return {
        message: 'OK',
        data: foundUser,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async update(
    id: number,
    { username, password, newPassword }: UpdateUserDto,
  ): Promise<DeleteUser | ErrorResponse> {
    try {
      const foundUser = await this.userRepository.findOne({ where: { id } });
      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundUsername = await this.userRepository.findOneBy({ username });

      if (foundUsername) {
        HttpStatus.BAD_REQUEST;
        throw new BadRequestException('username is already busy');
      }

      if (foundUser.password != password) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException('password is wrong');
      }

      await this.userRepository.update(id, {
        username,
        password: newPassword,
      });

      return {
        message: 'UPDATED',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async remove(id: number): Promise<DeleteUser> {
    try {
      const foundUser = await this.userRepository.findOne({ where: { id } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      await this.userRepository.remove(foundUser);

      return {
        message: 'DELETED',
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }
}
