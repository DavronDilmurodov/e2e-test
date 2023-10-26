import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ name: 'username', type: 'string', required: true })
  @IsString()
  @Length(3, 30)
  username: string;

  @ApiProperty({ name: 'password', type: 'string', required: true })
  @IsString()
  @Length(8, 30)
  password: string;

  @ApiProperty({ name: 'newPassword', type: 'string', required: true })
  @IsString()
  @Length(8, 30)
  newPassword: string;
}
