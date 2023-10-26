import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @ApiProperty({ required: true })
  @IsString()
  @Length(2, 20)
  title: string;

  @ApiProperty({ required: true })
  @IsString()
  text: string;
}
