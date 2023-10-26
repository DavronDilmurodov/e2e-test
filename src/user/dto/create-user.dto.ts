import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(3, 30)
  username: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(8, 30)
  password: string;
}
