import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  text: string;

  @Column({ default: false, nullable: true })
  isCompleted: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
}
