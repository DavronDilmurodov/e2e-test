import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 30)
  username: string;

  @IsString()
  @Length(8, 30)
  password: string;

  @IsString()
  @Length(8, 30)
  newPassword: string;
}
