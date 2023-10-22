import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../../models/user.model';
import { Todo } from '../../models/todo.model';
import { AuthResponse, DeleteUser, UserResponse } from '../types/response.type';
import { ErrorResponse } from '../../types/error.type';

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async signUp({
    password,
    username,
  }: CreateUserDto): Promise<AuthResponse | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({ where: { username } });

      if (foundUser) {
        HttpStatus.BAD_REQUEST;
        throw new BadRequestException('this username already busy');
      }

      const newUser = await this.userModel.create({
        username,
        password,
      });

      const payload = { id: newUser.id };

      const token = await this.jwtService.signAsync(payload);

      return {
        message: 'CREATED',
        data: { token },
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async signIn({
    password,
    username,
  }: CreateUserDto): Promise<AuthResponse | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({ where: { username } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      if (foundUser.password != password) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException('wrong password or username');
      }

      const payload = { id: foundUser.id };

      const token = await this.jwtService.signAsync(payload);

      return {
        message: 'OK',
        data: { token },
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async findOne(id: number): Promise<UserResponse | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({
        where: { id },
        include: [Todo],
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
    id: number,
    { username, password, newPassword }: UpdateUserDto,
  ): Promise<UserResponse | ErrorResponse> {
    try {
      const foundUser = await this.userModel.findOne({ where: { id } });
      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      const foundUsername = await this.userModel.findOne({
        where: { username },
      });

      if (foundUsername) {
        HttpStatus.BAD_REQUEST;
        throw new BadRequestException('username is already busy');
      }

      if (foundUser.password != password) {
        HttpStatus.UNAUTHORIZED;
        throw new UnauthorizedException('password is wrong');
      }

      const updatedUser = await foundUser.update({
        username,
        password: newPassword.toString(),
      });

      return {
        message: 'UPDATED',
        data: updatedUser,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error.message);
      return error.response || null;
    }
  }

  async remove(id: number): Promise<DeleteUser> {
    try {
      const foundUser = await this.userModel.findOne({ where: { id } });

      if (!foundUser) {
        HttpStatus.NOT_FOUND;
        throw new NotFoundException('user not found');
      }

      await foundUser.destroy();

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
