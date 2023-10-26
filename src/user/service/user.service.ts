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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    { password, username }: CreateUserDto,
    file: string,
  ): Promise<AuthResponse | ErrorResponse> {
    try {
      if (!file) {
        HttpStatus.BAD_REQUEST;
        throw new BadRequestException('avatar is required');
      }
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
        avatar: file,
      });

      await this.userRepository.save(newUser);

      const payload = { id: newUser.id };

      return {
        message: 'CREATED',
        data: newUser,
        token: await this.jwtService.signAsync(payload),
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

      const payload = { id: foundUser.id };

      HttpStatus.OK;

      return {
        message: 'OK',
        data: foundUser,
        token: await this.jwtService.signAsync(payload),
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async findOne(token: string): Promise<UserResponse | ErrorResponse> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

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
    { username, password, newPassword }: UpdateUserDto,
    token: string,
    avatar: string,
  ): Promise<DeleteUser | ErrorResponse> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

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

      await this.userRepository.update(foundUser.id, {
        username,
        password: newPassword,
        avatar,
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

  async remove(token: string): Promise<DeleteUser> {
    try {
      let decodedtoken;

      try {
        decodedtoken = await this.jwtService.verifyAsync(token);
      } catch (error) {
        HttpStatus.FORBIDDEN;
        return error.message;
      }

      const foundUser = await this.userRepository.findOneBy({
        id: decodedtoken.id,
      });

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
