import { IsString, Length } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @Length(2, 20)
  title: string;

  @IsString()
  text: string;
}
