import { UserType } from './user.type';

export interface AuthResponse {
  message: string;
  data?: UserType;
  token?: string;
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
