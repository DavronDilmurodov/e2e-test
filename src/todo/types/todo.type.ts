import { User } from '../../user/entities/user.entity';

export interface TodoType {
  id: number;
  title: string;
  text: string;
  isCompleted: boolean;
  user: User;
}
