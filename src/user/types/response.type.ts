import { UserType } from './user.type';

export interface AuthResponse {
  message: string;
  data: object;
  statusCode: number;
}

export interface UserResponse {
  message: string;
  data: UserType;
  statusCode: number;
}

export interface DeleteUser {
  message: string;
  statusCode: number;
}
